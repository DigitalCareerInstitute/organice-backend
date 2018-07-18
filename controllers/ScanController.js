const mongoose = require("mongoose");
const Scan = require("../models/Scan");

exports.createScan = async (req, res) => {
  const scan = await new Scan(req.body).save();
  console.log(`Successfully created '${scan.title}'`);
  res.json({
    code: 200,
    message: `Successfully created '${scan.title}'`,
    scan: {
      title: req.body.title
    }
  });
};

exports.updateScan = async (req, res) => {
  const scan = await Scan.findOneAndUpdate({ _id: req.headers.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  console.log(scan);
  console.log(`Successfully updated '${scan.title}'`);
  res.json({
    code: 200,
    message: `Successfully updated '${scan.title}'`,
    scan: {
      title: req.body.title
    }
  });
};

exports.deleteScan = async (req, res) => {
  const scan = await Scan.findOne({ _id: req.headers.id }).remove();
  console.log(req.headers);
  console.log(`Successfully removed`);
  res.json({
    code: 200,
    message: `Successfully removed`,
    scan: {}
  });
};
