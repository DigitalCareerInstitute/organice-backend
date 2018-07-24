const mongoose = require("mongoose");
const Scan = require("../models/Scan");

exports.getScans = async (req, res) => {
  const scans = await Scan.find();
  res.json({
    code: 200,
    message: `All scans`,
    scans: scans
  });
};

exports.createScan = async (req, res) => {
  let scanObject = {
    user: req.user._id,
    title: req.body.title
  };
  const scan = await new Scan(scanObject).save();
  res.json({
    code: 200,
    message: `Successfully created '${scan.title}'`,
    scan: {
      user_name: req.user.name,
      user_id: req.user._id,
      scan_title: req.body.title,
      scan_id: scan._id
    }
  });
};

// Display form for editing a project

const confirmOwner = (scan, user) => {
  if (!scan.user.equals(user._id)) {
    throw Error("You must own a scan in order to edit it!");
  }
};

exports.createScanOld = async (req, res) => {
  const scan = await new Scan(req.body).save();
  res.json({
    code: 200,
    message: `Successfully created '${scan.title}'`,
    scan: {
      title: req.body.title
    }
  });
};

exports.updateScan = async (req, res) => {
  const scan = await Scan.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  if (!scan) {
    res.json(404, {
      code: 404,
      message: "scan not found"
    });
    next(false);
  }
  res.json({
    code: 200,
    message: `Successfully updated '${scan.title}'`,
    scan: {
      user_name: req.user.name,
      user_id: req.user._id,
      scan_title: req.body.title,
      scan_id: scan._id
    }
  });
};

exports.deleteScan = async (req, res) => {
  const scan = await Scan.findOne({ _id: req.params.id });

  if (scan === null) {
    res.json({
      code: 404,
      message: `Scan not found`
    });
    return;
  }

  if (req.params.id === scan.id) {
    scan.remove(function(err) {
      if (err) throw err;
      res.json({
        code: 200,
        message: `Successfully removed`
      });
    });
  }
};
