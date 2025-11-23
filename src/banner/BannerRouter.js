const express = require('express');
const {
  uploadBanner,
  getAllBanners,
  deleteBanner,
  getSingleBanner
} = require('./controller');
const multer = require('multer');
const { auth } = require('../middleware/auth');
const upload = multer({ dest: 'upload/' });

const router = express.Router();

router.post('/add', auth, upload.single('file'), uploadBanner);
router.get('/', getAllBanners);
router.delete('/delete/:banner_id', auth, deleteBanner);
router.get('/:banner_id', getSingleBanner);

module.exports = router;
