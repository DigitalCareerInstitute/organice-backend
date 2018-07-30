const mongoose = require("mongoose");
const Category = require("../models/Category");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.json({
      code: 200,
      message: `All categories`,
      categories: categories
    });
  } catch (err) {
    console.log(err);
    res.json({
      code: 404,
      message: `No categories were found`
    });
  }
  next();
};

exports.createCategory = async (req, res, next) => {
  let categoryObject = {
    user: req.user._id,
    title: req.body.title
    // icon: req.body.icon
  };

  // const foundCategory = await Category.findOne(
  //   { title: req.body.title },
  //   req.body
  // ).exec();

  // if (foundCategory) {
  //   res.json({
  //     code: 401,
  //     message: "This category is already existed , Please choose another name"
  //   });
  //   console.log(
  //     `This category is already existed , Please choose another name`
  //   );
  //   next();
  //   return;
  // }
  const category = await new Category(categoryObject).save();
  res.json({
    code: 200,
    message: `Successfully created '${category.title}'`,
    category: {
      user_name: req.user.name,
      user_id: req.user._id,
      category_title: req.body.title,
      category_id: category._id
      // icon: req.body.icon
    }
  });
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).exec();
    console.log(category);
    console.log(`Successfully updated '${category.title}'`);
    res.json({
      code: 200,
      message: `Successfully updated '${category.title}'`,
      scan: {
        user_name: req.user.name,
        user_id: req.user._id,
        category_title: req.body.title,
        category_id: category._id
      }
    });
  } catch (err) {
    console.log("NOT FOUND");
    res.json(404, {
      code: 404,
      message: "category not found"
    });
    next(false);
    return;
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });

    if (!category) {
      res.json({
        code: 404,
        message: `Category not found`
      });
      next(false);
      return;
    }
  } catch (message) {
    res.json({
      code: 404,
      message: "Category not found "
    });
  }

  try {
    const category = await Category.findOne({ _id: req.params.id });

    if (req.params.id === category.id) {
      console.log("=============Category=============");
      console.log(category);
      category.remove();

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

exports.deleteAllCategories = async (req, res, next) => {
  category.remove({}, function(err) {
    console.log("All CATEGORIES are removed");
    res.send("Successfully deleted all CATEGORIES");
    next();
  });
};
