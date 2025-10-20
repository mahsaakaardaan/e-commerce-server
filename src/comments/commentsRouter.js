const express = require('express');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  getUserCommentById,
  getProductComments,
  uploadCommentImage
} = require('./controller');
const router = express.Router();

router.post(
  '/add-comment',
  upload.single('file'),
  auth,
  uploadCommentImage
);
router.get('/get-by-user', auth, getUserCommentById);
router.get('/:product_id', getProductComments);

module.exports = router;
