const express = require('express');
const {
  getAllCategories,
  addCategory,
  getCategoryById,
  updateCategory
} = require('./controller.js');

const router = express.Router();

router.get('/', getAllCategories);
router.post('/add', addCategory);
router.get('/:id', getCategoryById);
router.patch('/update/:id',updateCategory)

module.exports = router;
