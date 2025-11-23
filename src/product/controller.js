const db = require('../../connection');
const cloudinary = require('../cloudinaryConfig');
const fs = require('fs');

const getAllProducts = (req, res) => {
  const q =
    'SELECT p.*,c.id AS categoryId,c.fa_name,c.en_name,s.id AS subCategoryId,s.fa_s_name,en_s_name,cv.id AS variantId,cv.color,cv.hex,cv.count,cv.price FROM product AS p LEFT JOIN `category` AS c ON (p.product_category_id = c.id) LEFT JOIN `sub-category` AS s ON (p.product_sub_id = s.id) LEFT JOIN `color-variant` AS cv ON (p.id = cv.product_id)';
  db.query(q, (err, data) => {
    if (err)
      res
        .status(500)
        .json({ message: 'gatAllProducts error ' + err });
    const product = {};
    data.forEach((row) => {
      if (!product[row.id]) {
        product[row.id] = {
          id: row.id,
          thumbnail: row.thumbnail,
          title: row.title,
          description: row.description,
          categoryId: row.categoryId,
          fa_name: row.fa_name,
          en_name: row.en_name,
          subCategoryId: row.subCategoryId,
          fa_s_name: row.fa_s_name,
          en_s_name: row.en_s_name,
          off: row.off,
          variants: []
        };
      }
      product[row.id].variants.push({
        id: row.varianId,
        color: row.color,
        hex: row.hex,
        count: row.count,
        price: row.price
      });
    });
    return res.status(200).json({ data: Object.values(product) });
  });
};

const getIncredibleProducts = (req, res) => {
  const q =
    'SELECT p.*,c.id AS categoryId,c.fa_name,c.en_name,s.id AS subCategoryId,s.fa_s_name,en_s_name,cv.id AS variantId,cv.color,cv.hex,cv.count,cv.price FROM product AS p LEFT JOIN `category` AS c ON (p.product_category_id = c.id) LEFT JOIN `sub-category` AS s ON (p.product_sub_id = s.id) LEFT JOIN `color-variant` AS cv ON (p.id = cv.product_id) WHERE p.off > 3 ORDER BY off DESC';
  db.query(q, (err, data) => {
    if (err)
      res
        .status(500)
        .json({ message: 'gatAllProducts error ' + err });
    const product = {};
    data.forEach((row) => {
      if (!product[row.id]) {
        product[row.id] = {
          id: row.id,
          thumbnail: row.thumbnail,
          title: row.title,
          description: row.description,
          categoryId: row.categoryId,
          fa_name: row.fa_name,
          en_name: row.en_name,
          subCategoryId: row.subCategoryId,
          fa_s_name: row.fa_s_name,
          en_s_name: row.en_s_name,
          off: row.off,
          variants: []
        };
      }
      product[row.id].variants.push({
        id: row.varianId,
        color: row.color,
        hex: row.hex,
        count: row.count,
        price: row.price
      });
    });
    return res.status(200).json({ data: Object.values(product) });
  });
};

const getProductById = (req, res) => {
  const { id } = req.params;
  const q =
    'SELECT p.*,c.id AS categoryId,c.fa_name,c.en_name,s.id AS subCategoryId,s.fa_s_name,s.en_s_name,cv.id AS variantId,cv.color,cv.hex,cv.count,cv.price FROM product AS p LEFT JOIN category AS c ON (c.id = p.product_category_id) LEFT JOIN `sub-category` AS s ON (s.id = p.product_sub_id) LEFT JOIN `color-variant` AS cv ON (cv.product_id = p.id) WHERE p.id = ?';
  db.query(q, [id], (err, data) => {
    if (err)
      res.status(500).json({ message: 'getProductById error' + err });
    let product = {};
    data.forEach((row) => {
      if (!product[row.id]) {
        product[row.id] = {
          id: row.id,
          thumbnail: row.thumbnail,
          title: row.title,
          description: row.description,
          categoryId: row.categoryId,
          fa_name: row.fa_name,
          en_name: row.en_name,
          subCategoryId: row.subCategoryId,
          fa_s_name: row.fa_s_name,
          en_s_name: row.en_s_name,
          off: row.off,
          variants: []
        };
      }
      product[row.id].variants.push({
        id: row.variantId,
        color: row.color,
        hex: row.hex,
        count: row.count,
        price: row.price
      });
    });
    return res.status(200).json({ data: Object.values(product) });
  });
};

const uploadProductThumbnail = async (req, res) => {
  let image_url = '';

  if (req.file) {
    try {
      const uploadResult = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: 'products'
        }
      );
      image_url = uploadResult.secure_url;

      // پاک کردن فایل موقت بعد از آپلود
      fs.unlinkSync(req.file.path);
      addProduct(req, res, image_url);
      // adComment(req, res, image_url);
    } catch (uploadErr) {
      console.error('Cloudinary upload error:', uploadErr);
      return res
        .status(500)
        .json({ message: 'cloudinary error: ' + uploadErr.message });
    }
  } else {
    addProduct(req, res, image_url);
    // adComment(req, res, null);
  }
};

const addProduct = (req, res, image_url) => {
  const {
    title,
    description,
    off,
    product_category_id,
    product_sub_id,
    variants
  } = req.body;

  const q =
    'INSERT INTO product (thumbnail,title,description,off,product_category_id,product_sub_id) VALUES (?,?,?,?,?,?)';
  db.query(
    q,
    [
      image_url,
      title,
      description,
      off,
      product_category_id,
      product_sub_id
    ],
    (err, data) => {
      if (err)
        res.status(500).json({ message: 'addProduct error ' + err });
      const productId = data.insertId;
      const variantsValue = JSON.parse(variants).map((v) => [
        v.color,
        v.hex,
        v.count,
        v.price,
        productId
      ]);
      const vq =
        'INSERT INTO `color-variant` (color,hex,count,price,product_id) VALUES ?';
      db.query(vq, [variantsValue], (vErr, vData) => {
        if (vErr)
          res
            .status(500)
            .json({ message: 'color variant error' + vErr });
        res.status(200).json({ data: 'product added' });
      });
    }
  );
};

const searchFilterProduct = (req, res) => {
  const {
    s,
    categoryId,
    subCategoryId,
    maxPrice,
    minPrice,
    color,
    sortBy,
    order
  } = req.query;

  let q =
    'SELECT p.*,c.id AS categoryId,c.fa_name,c.en_name,s.id AS subCategoryId,s.fa_s_name,en_s_name,cv.id AS variantId,cv.color,cv.hex,cv.count,cv.price FROM product AS p LEFT JOIN `category` AS c ON (p.product_category_id = c.id) LEFT JOIN `sub-category` AS s ON (p.product_sub_id = s.id) LEFT JOIN `color-variant` AS cv ON (p.id = cv.product_id) WHERE 1=1';
  let queryParams = [];
  if (s) {
    q += ' AND (title LIKE ? OR description LIKE ?)';
    queryParams.push(`%${s}%`, `%${s}%`);
  }
  if (categoryId) {
    q += ' AND c.id = ?';
    queryParams.push(categoryId);
  }
  if (subCategoryId) {
    q += ' AND s.id = ?';
    queryParams.push(subCategoryId);
  }
  if (maxPrice) {
    q += ' AND cv.price <= ?';
    queryParams.push(maxPrice);
  }
  if (minPrice) {
    q += ' AND cv.price >= ?';
    queryParams.push(minPrice);
  }
  if (color) {
    q += ' AND cv.color = ?';
    queryParams.push(color);
  }
  //   if(sortBy){
  //     const validColumn = ['price'];
  //     if(validColumn.includes(sortBy)){
  //         order = order === 'asc' ? "ASC" : "DESC";

  //     }
  //   }
  db.query(q, queryParams, (err, data) => {
    if (err)
      res.status(500).json({ message: 'searchFilterProduct error' });
    const product = {};
    data?.forEach((row) => {
      if (!product[row.id]) {
        product[row.id] = {
          id: row.id,
          thumbnail: row.thumbnail,
          title: row.title,
          description: row.description,
          categoryId: row.categoryId,
          fa_name: row.fa_name,
          en_name: row.en_name,
          subCategoryId: row.subCategoryId,
          fa_s_name: row.fa_s_name,
          en_s_name: row.en_s_name,
          off: row.off,
          variants: []
        };
      }
      product[row.id].variants.push({
        id: row.varianId,
        color: row.color,
        hex: row.hex,
        count: row.count,
        price: row.price
      });
    });
    return res.status(200).json({ data: Object.values(product) });
  });
};

const updateProduct = (req, res) => {
  const { id } = req.params;
  const {
    thumbnail,
    title,
    description,
    product_category_id,
    product_sub_id,
    off,
    variantIds,
    deletedVariantIds,
    newVariants
    // variantIds => [{id: 2,color: 'pink',count: 4,hex: '#555555',price: 2000},{}]
    // newVariants => [{color: 'pink',count: 4,hex: '#555555',price: 2000},{}]
  } = req.body;
  const q =
    'UPDATE product SET thumbnail = ?,title = ?, description = ?, product_category_id = ?,product_sub_id = ?, off = ? WHERE id = ?';
  db.query(
    q,
    [
      thumbnail,
      title,
      description,
      product_category_id,
      product_sub_id,
      off,
      id
    ],
    (err, data) => {
      if (err)
        res.status(500).json({ message: 'updateProduct error' });
      if (deletedVariantIds) {
        const dv = 'DELETE FROM `color-variant` WHERE id IN (?)';
        db.query(dv, [deletedVariantIds], (dvError, dvData) => {
          if (dvError)
            res
              .status(500)
              .json({ message: 'delete variants error ' + dvError });
        });
        // return res.status(200).json({ data: 'delete variants' });
      }
      let vq = '';
      if (variantIds) {
        vq = 'UPDATE `color-variant` SET ';
        let cases = {
          color: 'color = CASE ',
          hex: 'hex = CASE ',
          count: 'count = CASE ',
          price: 'price = CASE '
        };
        let IDs = [];
        variantIds.forEach(
          ({ id: variantid, color, hex, count, price }) => {
            cases.color += `WHEN id = ${variantid} THEN '${color}' `;
            cases.hex += `WHEN id = ${variantid} THEN '${hex}' `;
            cases.count += `WHEN id = ${variantid} THEN '${count}' `;
            cases.price += `WHEN id = ${variantid} THEN '${price}' `;
            IDs.push(variantid);
          }
        );

        cases.color += 'END, ';
        cases.hex += 'END, ';
        cases.count += 'END, ';
        cases.price += 'END ';

        vq += cases.color + cases.hex + cases.count + cases.price;
        vq += `WHERE product_id = ${id} AND id IN (${IDs.join(
          ', '
        )})`;
        db.query(vq, (vError, vData) => {
          if (vError)
            res
              .status(500)
              .json({ message: 'update variant Error' + vError });
          //   return res.status(200).json({ data: 'updated' });
        });
      }
      if (newVariants) {
        const newVariantsValues = newVariants.map((v) => [
          v.color,
          v.hex,
          v.count,
          v.price,
          id
        ]);
        const newVq =
          'INSERT INTO `color-variant` (color,hex,count,price,product_id) VALUES ?';
        db.query(
          newVq,
          [newVariantsValues],
          (newVError, newVData) => {
            if (newVError)
              res
                .status(500)
                .json({ message: 'new Variant error ' + newVError });
            // return res
            //   .status(200)
            //   .json({ data: 'new variant added' });
          }
        );
      }
      return res.status(200).json({ data: 'hiii' });
    }
  );
};

const deleteProduct = (req, res) => {
  const { id } = req.params;
  const q = 'DELETE FROM product WHERE id = ?';
  db.query(q, [id], (err, data) => {
    if (err) res.status(500).json({ message: 'deleteProduct error' });
    return res.status(200).json({ data: 'deleted' });
  });
};

module.exports = {
  getAllProducts,
  addProduct,
  uploadProductThumbnail,
  searchFilterProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getIncredibleProducts
};
