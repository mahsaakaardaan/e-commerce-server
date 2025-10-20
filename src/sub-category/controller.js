const db = require('../../connection');

const getAllSubCategories = (req, res) => {
  const q = 'SELECT * FROM `sub-category`';
  db.query(q, (err, data) => {
    if (err)
      res
        .status(500)
        .json({ message: 'getAllSubCategories error' + err });
    return res.status(200).json({ data });
  });
};

const getSubCategoriesByCategoryId = (req, res) => {
  const { id } = req.params;
  const q = 'SELECT * FROM `sub-category` WHERE category_id = ?';
  db.query(q, [id], (err, data) => {
    if (err)
      res
        .status(500)
        .json({ message: 'getSubCategoriesByCategoryId error' });
    return res.status(200).json({ data });
  });
};

const addSubCategory = (req, res) => {
  const data = req.body;
  const values = data.flatMap((d) => [
    d.fa_s_name,
    d.en_s_name,
    d.category_id
  ]);
  const placeholders = data.map(() => '(?,?,?)').join(', ');
  const q =
    'INSERT INTO `sub-category` (fa_s_name,en_s_name,category_id) VALUES ' +
    placeholders;
  db.query(q, values, (err, data) => {
    if (err)
      res.status(500).json({ message: 'addSubCategory error' + err });
    return res.status(200).json({ data: 'sub category added' });
  });
  // const {fa_s_name,en_s_name,category_id} = req.body;
  // const q = "INSERT INTO `sub-category` (fa_s_name,en_s_name,category_id) VALUES (?,?,?)"
  // db.query(q,[fa_s_name,en_s_name,category_id],(err,data) => {
  //     if(err) res.status(500).json({message: "addSubCategory error" + err})
  //     return res.status(200).json({data: "sub category added"})
  // })
};

module.exports = {
  getAllSubCategories,
  getSubCategoriesByCategoryId,
  addSubCategory
};
