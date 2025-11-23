const db = require('../../connection');
const cloudinary = require('../cloudinaryConfig');
const fs = require('fs');

const addStory = (req, res, image_url) => {
  const { title, description, date } = req.body;
  const q =
    'INSERT INTO story (title,description,date,image) VALUES (?,?,?,?)';
  db.query(q, [title, description, date, image_url], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'createStory error' + err });
    return res.status(200).json({ data: 'success' });
  });
};

const uploadStory = async (req, res) => {
  let image_url = '';
  if (req.file) {
    try {
      const uploadResult = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: 'story'
        }
      );
      image_url = uploadResult.secure_url;

      fs.unlinkSync(req.file.path);
      addStory(req, res, image_url);
    } catch (uploadErr) {
      console.error('Cloudinary upload error:', uploadErr);
      return res
        .status(500)
        .json({ message: 'cloudinary error: ' + uploadErr.message });
    }
  }
};

const deleteStory = (req, res) => {
  const { story_id } = req.params;
  const q = 'DELETE FROM story WHERE story_id = ?';
  db.query(q, [story_id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'deleteStory error' + err });
    return res.status(200).json({ data: 'success delete' });
  });
};

const getAllStory = (req, res) => {
  const q = 'SELECT * FROM story';
  db.query(q, (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getAllStory error' + err });
    return res.status(200).json({ data });
  });
};

const getSingleStory = (req, res) => {
  const { story_id } = req.params;
  const q = 'SELECT * FROM story WHERE story_id = ?';
  db.query(q, [story_id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getSingleStory error' + err });
    return res.status(200).json({ data });
  });
};

module.exports = {
  uploadStory,
  deleteStory,
  getAllStory,
  getSingleStory
};
