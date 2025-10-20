const express = require('express');
const { getAllSubCategories,getSubCategoriesByCategoryId ,addSubCategory} = require('./controller');

const router = express.Router();

router.get('/',getAllSubCategories)
router.get('/sub-categories/category-id/:id',getSubCategoriesByCategoryId)
router.post('/add',addSubCategory)


module.exports = router; 