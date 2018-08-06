const mongoose = require("mongoose");
const Category = require("../models/Category");
const ScanSchema = require("../models/Scan");

exports.getCategories = async (req, res, next) => {
  const user = req.user;
  try {
    const categories = await Category.find({ user: req.user._id });
    res.json(200, {
      code: 200,
      message: `All categories for '${user.name}'`,
      user: user,
      categories: categories
    });
  } catch (err) {
    console.log(err);
    res.json(404, {
      code: 404,
      message: `No categories were found for '${user.name}'`
    });
  }
  next();
};

exports.getSingleCategory = async (req, res, next) => {
  const user = req.user;
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(200, {
      code: 200,
      message: `Single category for '${user.name}' `,
      category: category
    });
  } catch (err) {
    res.json(404, {
      code: 404,
      message: `Category not found for '${user.name}'`
    });
    next(false);
    return;
  }
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
  //   res.json(401,{
  //     code: 401,
  //     message: "This category is already existed , Please choose another name"
  //   });
  //   console.log(
  //     `This category is already existed , Please choose another name`
  //   );
  //   next();
  //   return;
  // }
  try {
    const category = await new Category(categoryObject).save();
    res.json(200, {
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
  } catch (err) {
    console.log(err);
    res.json(422, {
      code: 422,
      message: "Unprocessable entity"
    });
  }
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
    console.log(`Successfully updated to: '${category.title}'`);
    res.json(200, {
      code: 200,
      message: `Successfully updated to: '${category.title}'`,
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
      res.json(404, {
        code: 404,
        message: `Category not found`
      });
      next(false);
      return;
    }
  } catch (message) {
    res.json(404, {
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

exports.deleteAllCategories = async (req, res, next) => {
  Category.remove({}, function(err) {
    console.log("All CATEGORIES are removed");
    res.send("Successfully deleted all CATEGORIES");
    next();
  });
};
