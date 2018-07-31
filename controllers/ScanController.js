const mongoose = require("mongoose");
const Scan = require("../models/Scan");
const multer = require("multer");
const jimp = require("jimp");
const uuid = require("uuid");
const fs = require("fs");

exports.getScans = async (req, res, next) => {
  try {
    const scans = await Scan.find({ user: req.user._id });
    res.json(200, {
      code: 200,
      message: `All scans`,
      scans: scans
    });
  } catch (err) {
    console.log(err);
    res.json(404, {
      code: 404,
      message: `No scans were found`
    });
  }
  next();
};

exports.getSingleScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id });
    res.json(200, {
      code: 200,
      message: `Single scan `,
      scan: scan
    });
  } catch (err) {
    res.json(404, {
      code: 404,
      message: "scan not found"
    });
    next(false);
    return;
  }
};

const storage = multer.diskStorage({
  destination: function(req, file, next) {
    next(null, "../temp");
  },
  filename: function(req, file, next) {
    next(null, uuid(4));
  }
});

exports.upload = multer({
  storage,
  limits: {
    fileSize: 10000000 // 10 MB
  },
  fileFilter(req, file, next) {
    const isImage = file.mimetype.startsWith("image/");
    if (isImage) {
      next(null, true);
    } else {
      next({ message: "That filetype is not allowed!" }, false);
    }
  }
}).single("image");

exports.uploadError = function(error, req, res, next) {
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

    // req.flash("danger", message);
    return res.json(422, {
      code: 422,
      message
    });
  }
  next();
};

exports.resize = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  console.log(req.body);
  const extension = req.file.mimetype.split("/")[1];
  req.body.image = `${uuid.v4()}.${extension}`;

  const image = await jimp.read(req.file.path);
  await image.cover(350, 180);
  await image.write(`./temp/uploads/scans/${req.body.image}`);
  fs.unlinkSync(req.file.path);

  next();
};

exports.createScan = async (req, res, next) => {
  let scanObject = {
    user: req.user._id,
    title: req.body.title,
    category: req.body.category,
    image: req.body.image,
    content: req.body.content,
    date: req.body.date
  };

  console.log("+++++++++++++++++SCAN OBJECT++++++++++++++++++");
  console.log(scanObject);

  try {
    const foundScan = await Scan.findOne(
      { title: req.body.title },
      req.body
    ).exec();

    if (foundScan) {
      res.json(401, {
        code: 401,
        message: "This scan is already existed , Please choose another name"
      });
      console.log(`This scan is already existed , Please choose another name`);
      next();
      return;
    }
    const scan = await new Scan(scanObject).save();
    res.json(200, {
      code: 200,
      message: `Successfully created '${scan.title}'`,
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
