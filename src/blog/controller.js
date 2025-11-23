const db = require('../../connection');
const cloudinary = require('../cloudinaryConfig');
const fs = require('fs');

const addBlog = (req, res, image_url) => {
  const { title, text, date } = req.body;
  const q =
    'INSERT INTO blog (title,image,text,date) VALUES (?,?,?,?)';
  db.query(q, [title, image_url, text, date], (err, data) => {
    if (err)
      return res.status(500).json({ message: 'addBlog Error' + err });
    return res.status(200).json({ data: 'success' });
  });
};

const uploadBlog = async (req, res) => {
  let image_url = '';
  if (req.file) {
    try {
      const uploadResult = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: 'blog'
        }
      );
      image_url = uploadResult.secure_url;

      fs.unlinkSync(req.file.path);
      addBlog(req, res, image_url);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'uploadBlog error' + error });
    }
  }
};

const deleteBlog = (req, res) => {
  const { blog_id } = req.params;
  const q = 'DELETE FROM blog WHERE blog_id = ?';
  db.query(q, [blog_id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'deleteBlog error' + err });
    return res.status(200).json({ data: 'success delete' });
  });
};

const getAllBlog = (req, res) => {
  const q = 'SELECT * FROM blog';
  db.query(q, (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getAllBlog error' + err });
    return res.status(200).json({ data });
  });
};

const getSingleBlog = (req, res) => {
  const { blog_id } = req.params;
  const q = 'SELECT * FROM blog WHERE blog_id = ?';
  db.query(q, [blog_id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getSingleBlog error' + err });
    return res.status(200).json({ data });
  });
};

module.exports = {
  uploadBlog,
  deleteBlog,
  getAllBlog,
  getSingleBlog
};
