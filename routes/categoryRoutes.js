const router = require('express').Router();
const Category = require('../models/Category');

//post a category
router.post('/', async (req, res) => {
  const newCategory = new Category(req.body);
  try {
    const saveCategory = await newCategory.save();
    res.status(200).json(saveCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all categories
router.get('/', async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.status(200).json(allCategories);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
