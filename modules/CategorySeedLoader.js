const mongoose = require("mongoose");
const fs = require("fs");

async function CategorySeedLoader(user) {
  const categories = JSON.parse(
    fs.readFileSync(__dirname + "/../data/seeds/categories.json", "utf-8")
  );

  categories.map(category => {
    category.user = user._id;
    return category;
  });

  const CategoryModel = require("../models/Category");
  await CategoryModel.insertMany(categories);
  process.exit();
}

module.exports.loadSeed = CategorySeedLoader;
