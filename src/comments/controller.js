const db = require('../../connection');
const cloudinary = require('../cloudinaryConfig');
const fs = require('fs');

const adComment = (req, res, image_url) => {
  
  
  const user_id = req.userId;

  const { product_id, comment_date, comment, variant_id } = req.body;
  const q =
    'INSERT INTO comments (user_id,product_id,comment_date,comment,variant_id,image_url) VALUES (?,?,?,?,?,?)';
  db.query(
    q,
    [user_id, product_id, 14040528, comment, variant_id, image_url],
    (err, date) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'createComment error' + err });

      return res.status(200).json({ data: 'successful' });
    }
  );
};

const uploadCommentImage = async (req, res) => {
  let image_url = '';
  

  if (req.file) {
    
    
    try {
      const uploadResult = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: 'comments'
        }
      );
      image_url = uploadResult.secure_url;

      // پاک کردن فایل موقت بعد از آپلود
      fs.unlinkSync(req.file.path);
      adComment(req, res, image_url);
    } catch (uploadErr) {
      console.error('Cloudinary upload error:', uploadErr);
      return res
        .status(500)
        .json({ message: 'cloudinary error: ' + uploadErr.message });
    }
  }else{
    adComment(req, res, image_url);
  }
};

const getUserCommentById = (req, res) => {
  const user_id = req.userId;
  const q =
    'SELECT c.*,p.*,cv.* FROM comments AS c LEFT JOIN product AS p ON (p.id = c.product_id) LEFT JOIN `color-variant` AS cv ON (c.variant_id = cv.id) WHERE user_id = ?';
  db.query(q, [user_id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getUserCommentById error' + err });

    const comments = {};
    data.forEach((row) => {
      if (!comments[row.comment_id]) {
        comments[row.comment_id] = {
          comment_id: row.comment_id,
          user_id: row.user_id,
          product_id: row.product_id,
          comment_date: row.comment_date,
          comment: row.comment,
          image_url: row.image_url,
          variant_id: row.variant_id,
          product: {
            id: row.id,
            title: row.title,
            thumbnail: row.thumbnail
          },
          variant: {
            id: row.variant_id,
            hex: row.hex,
            color: row.color
          }
        };
      }
    });
    return res.status(200).json({ data: Object.values(comments) });
  });
};

const getProductComments = (req, res) => {
  const { product_id } = req.params;
  const q =
    'SELECT c.*,u.name AS user_name FROM comments AS c LEFT JOIN user AS u ON (u.user_id = c.user_id) WHERE product_id = ?';
  db.query(q, [product_id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getProductComments error' + err });
    return res.status(200).json({ data });
  });
};

module.exports = {
  uploadCommentImage,
  getUserCommentById,
  getProductComments
};
