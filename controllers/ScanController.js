const {parse, stringify} = require('flatted/cjs');
const mongoose = require("mongoose");
const scanSchema = require("../models/Scan");
const Scan = mongoose.model("Scan", scanSchema);
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
const Tesseract = require('tesseract.js')
const { createRecursiveFolderPath } = require('../handlers/helpers')
const FILE_PATH = "./temp/uploads/scans/";

exports.getScans = async (req, res, next) => {
  const user = req.user;
  try {
    const scans = await Scan.find({ user: req.user._id });
    res.json(200, {
      code: 200,
      message: `All scans for '${user.name}'`,
      user: user,
      scans: scans
    });
  } catch (err) {
    console.log(err);
    res.json(404, {
      code: 404,
      message: `No scans were found for '${user.name}'`
    });
  }
  next();
};

exports.getSingleScan = async (req, res, next) => {
  const user = req.user;
  try {
    const scan = await Scan.findOne({ _id: req.params.id });
    res.json(200, {
      code: 200,
      message: `Single scan for '${user.name}' `,
      scan: scan
    });
  } catch (err) {
    res.json(404, {
      code: 404,
      message: `Scan not found for '${user.name}'`
    });
    next(false);
    return;
  }
};

exports.upload = (req, res, next) => {
  // console.log("++++++++ Multer Req ++++++++");
  // console.log(req);

  const storage = multer.diskStorage({
    destination: function(req, file, next) {
      next(null, "./temp_multer");
    },
    filename: function(req, file, next) {
      next(null, uuid(4));
    }
  });

  multer({
    storage,
    limits: {
      fileSize: 10000000 // 10 MB
    },
    fileFilter(req, file, next) {
      console.log("++++++++ Multer Req ++++++++");
      console.log(req);
      const isImage = file.mimetype.startsWith("image/");
      console.log(storage);
      console.log("test-req-multer");
      console.log(req);
      if (isImage) {
        next(null, true);
      } else {
        next({ message: "That filetype is not allowed!" }, false);
      }
    }
  }).single("image");
};

exports.uploadError = function(error, req, res, next) {
  console.log(req.file);

  if (error) {
    let message = "Error during file upload. Please try again later.";

    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        message = "The file is too large. Max. 10 MB allowed!";
        break;

      case "FILETYPE_NOT_ALLOWED":
        message =
          'The file type is not allowed. Only file types "JPEG, PNG, GIF" allowed!';
        break;
    }

    return res.json(422, {
      code: 422,
      message
    });
  }
  next();
};

exports.resize = async (req, res, next) => {
  if (!req.files || !req.files.image){
    return res.json(404, {
      code: 404,
      message: "NO IMAGE PROVIDED"
    });
    next(false);
  }

  const filename = `${uuid.v4()}`;
  const extension = req.files.image.type.split("/")[1];

  const files = {
    original: {
      name: `${filename}.${extension}`,
      path: FILE_PATH,
      file: `${FILE_PATH}${filename}.${extension}`
    },
    thumbnail: {
      name: `${filename}-400x400.${extension}`,
      path: FILE_PATH,
      file: `${FILE_PATH}${filename}-400x400.${extension}`
    }
  };

  createRecursiveFolderPath(FILE_PATH);

  // move the original image
  fs.renameSync(req.files.image.path, files.original.file);

  // create thumbnail
  const thumbnailImage = await jimp.read(files.original.file);
  await thumbnailImage.cover(400, 400).quality(70);
  await thumbnailImage.write(files.thumbnail.file);

  req.image = files.original;

  next();
};

exports.recognizeText = async (req, res, next) => {
  
  const tesseract = Tesseract.create({
    workerPath: path.join(__dirname, '../tesseract/src/node/worker.js'),
    langPath: path.join(__dirname, '../tesseract/langs/'),
    corePath: path.join(__dirname, '../tesseract/src/index.js')
  })
    
  tesseract.recognize(req.image.file)
  .progress(function(message){
    console.log(message)
  })
    .then(function (result) {
      req.recognizedText = result
      next();
    })
    .catch(err => console.error(err))
}
  
exports.createScan = async (req, res, next) => {

  try {
    const foundScan = await Scan.findOne(
      { title: req._body.title },
      req.body
    ).exec();

    if (foundScan) {
      res.json(401, {
        code: 401,
        message: "This scan is already existed , Please choose another name"
      });
      console.log(`This scan is already existed , Please choose another name`);
      next(false);
      return;
    }
    
    parsedRecognizedText = JSON.parse(stringify(req.recognizedText));
    
    let scanObject = {
      user: req.user._id,
      title: req._body.title,
      category: req._body.category,
      image: req.image.name,
      content: req._body.content,
      date: req._body.date,
      recognizedText: {
        text: req.recognizedText.text,
        html: req.recognizedText.html,
        confidence: req.recognizedText.confidence,
        completeData: parsedRecognizedText
      },
    };

    const scan = await new Scan(scanObject).save();

    res.json(200, {
      code: 200,
      message: `Successfully created '${scan.title}'`,
      scan: scanObject
    });

  } catch (err) {
    console.log(err);
    res.json(422, {
      code: 422,
      message: "Unprocessable entity"
    });
  }
};

exports.updateScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id }).exec();
    // console.log("===================FOUND SCAN===============================");
    // console.log(foundScan);
    if (scan.title === req.body.title) {
      res.json(401, {
        code: 401,
        message: "This scan is already existed , Please choose another name"
      });
      console.log(`Please choose another name`);
      next(false);
      return;
    }
  } catch {
    console.log("NOT FOUND ");
    res.json(404, {
      code: 404,
      message: "scan not found"
    });
    next(false);
    return;
  }

  try {
    const scan = await Scan.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true
    }).exec();

    console.log(scan);
    console.log(`Successfully updated to: '${scan.title}'`);
    res.json(200, {
      code: 200,
      message: `Successfully updated to: '${scan.title}'`,
      scan: {
        user_name: req.user.name,
        user_id: req.user._id,
        scan_title: req.body.title,
        scan_id: scan._id,
        scan_category: req.body.category,
        image: req.body.image,
        content: req.body.content,
        date: req.body.date
      }
    });
  } catch (err) {
    console.log(err);
    res.json(422, {
      code: 422,
      message: "Unprocessable entity"
    });
  }
};

exports.deleteScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id });

    if (!scan) {
      res.json(404, {
        code: 404,
        message: `Scan not found`
      });
      next(false);
      return;
    }
  } catch (message) {
    res.json(404, {
      code: 404,
      message: "Scan not found "
    });
  }

  try {
    const scan = await Scan.findOne({ _id: req.params.id });

    if (req.params.id === scan.id) {
      console.log("=============scan=============");
      console.log(scan);
      scan.remove();

      console.log(`Successfully removed`);
      res.json(200, {
        code: 200,
        message: `Successfully removed`
      });
    }
  } catch (message) {
    res.json(403, {
      code: 403,
      message: "ERROR FORBIDDEN"
    });
  }
};

exports.deleteAllScans = async (req, res, next) => {
  Scan.remove({}, function(err) {
    console.log("All SCANS are removed");
    res.send("Successfully deleted all SCANS");
    next();
  });
};
