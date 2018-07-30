const mongoose = require("mongoose");
const Scan = require("../models/Scan");

exports.getScans = async (req, res, next) => {
  try {
    const scans = await Scan.find({ user: req.user._id });
    res.json({
      code: 200,
      message: `All scans`,
      scans: scans
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 404,
      message: `No scans were found`
    });
  }
  next();
};

exports.getSingleScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOne();
    res.json({
      code: 200,
      message: `All scans`,
      scans: scans
    });
  } catch (err) {
    console.log(err);
  }
};

exports.createScan = async (req, res, next) => {
  let scanObject = {
    user: req.user._id,
    title: req.body.title,
    category: req.body.category,
    // category: req.headers.id,
    image: req.body.image,
    content: req.body.content,
    date: req.body.date
  };

  console.log("SCAN OBJECT");
  console.log(scanObject);

  const foundScan = await Scan.findOne(
    { title: req.body.title },
    req.body
  ).exec();

  if (foundScan) {
    res.json({
      code: 401,
      message: "This scan is already existed , Please choose another name"
    });
    console.log(`This scan is already existed , Please choose another name`);
    next();
    return;
  }
  const scan = await new Scan(scanObject).save();
  res.json({
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
};

// Display form for editing a project

const confirmOwner = (scan, user) => {
  if (!scan.user.equals(user._id)) {
    throw Error("You must own a scan in order to edit it!");
  }
};

exports.updateScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id }).exec();
    // console.log("===================FOUND SCAN===============================");
    // console.log(foundScan);
    if (scan.title === req.body.title) {
      res.json({
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

  const scan = await Scan.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();

  console.log(scan);
  console.log(`Successfully updated '${scan.title}'`);
  res.json({
    code: 200,
    message: `Successfully updated '${scan.title}'`,
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
};

exports.deleteScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id });

    if (!scan) {
      res.json({
        code: 404,
        message: `Scan not found`
      });
      next(false);
      return;
    }
  } catch (message) {
    res.json({
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
      res.json({
        code: 200,
        message: `Successfully removed`
      });
    }
  } catch (message) {
    res.json({
      code: 403,
      message: "ERROR"
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
