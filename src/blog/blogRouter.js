const express = require('express');

const {
  uploadBlog,
  deleteBlog,
  getAllBlog,
  getSingleBlog
} = require('./controller');
const multer = require('multer');
const upload = multer({ dest: 'upload/' });

const router = express.Router();

router.post('/add', upload.single('file'), uploadBlog);
router.get('/', getAllBlog);
router.delete('/delete/:blog_id', deleteBlog);
router.get('/:blog_id', getSingleBlog);

module.exports = router;
