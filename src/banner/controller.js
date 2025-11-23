const db = require('../../connection');
const cloudinary = require('../cloudinaryConfig');
const fs = require('fs');

const addBanner = (req, res, image_url) => {
  const { text, search } = req.body;
  const q = 'INSERT INTO banner (text,image,search) VALUES (?,?,?)';
  db.query(q, [text, image_url, search], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'addBanner error' + err });
    return res.status(200).json({ data: 'success' });
  });
};

const uploadBanner = async (req, res) => {
  let image_url = '';
  if (req.file) {
    try {
      const uploadResult = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: 'banner'
        }
      );
      image_url = uploadResult.secure_url;

      fs.unlinkSync(req.file.path);
      addBanner(req, res, image_url);
    } catch (error) {
      console.log('Cloudinary upload error:', error);
      return res
        .status(500)
        .json({ message: 'cloudinary error' + error.message });
    }
  }
};

const deleteBanner = (req, res) => {
  const { banner_id } = req.params;
  const q = 'DELETE FROM banner WHERE banner_id = ?';
  db.query(q, [banner_id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'deleteBanner error' + err });
    return res.status(200).json({ data: 'successful' });
  });
};

const getAllBanners = (req, res) => {
  const q = 'SELECT * FROM banner';
  db.query(q, (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getAllBanners error' + err });
    return res.status(200).json({ data });
  });
};

const getSingleBanner = (req, res) => {
  const { banner_id } = req.params;
  const q = 'SELECT * FROM banner WHERE banner_id = ?';
  db.query(q, [banner_id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getSingleBanner error' + err });
    return res.status(200).json({ data });
  });
};

module.exports = {
  uploadBanner,
  deleteBanner,
  getAllBanners,
  getSingleBanner
};
