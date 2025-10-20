const express = require('express');
const {
  getAllProducts,
  addProduct,
  searchFilterProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  uploadProductThumbnail
} = require('./controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/', getAllProducts);
router.get('/single/:id', getProductById);
router.post('/add', upload.single('file'), uploadProductThumbnail);
router.get('/search', searchFilterProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);

module.exports = router;
