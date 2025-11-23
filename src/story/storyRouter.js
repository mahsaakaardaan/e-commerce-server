const express = require('express');

const {
  uploadStory,
  getAllStory,
  deleteStory,
  getSingleStory
} = require('./controller');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'upload/' });

const router = express.Router();

router.post('/add', auth, upload.single('file'), uploadStory);
router.get('/', getAllStory);
router.delete('/delete/:story_id', auth, deleteStory);
router.get('/:story_id', getSingleStory);

module.exports = router;
