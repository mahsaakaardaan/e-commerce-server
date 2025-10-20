const db = require('../../connection');

const getAllCategories = (req, res) => {
  const q =
    'SELECT c.*,s.id AS sub_category_id,s.fa_s_name,s.en_s_name FROM category AS c LEFT JOIN `sub-category` AS s ON (c.id = s.category_id)';
  db.query(q, (err, data) => {
    if (err)
      res.status(500).json({ message: 'getAllCategories error' });
    const category = {};
    data.forEach((row) => {
      if (!category[row.id]) {
        category[row.id] = {
          id: row.id,
          fa_name: row.fa_name,
          en_name: row.en_name,
          subs: []
        };
      }
      category[row.id].subs.push({
        id: row.sub_category_id,
        fa_s_name: row.fa_s_name,
        en_s_name: row.en_s_name
      });
    });
    return res.status(200).json({ data: Object.values(category) });
  });
};

const addCategory = (req, res) => {
  const { fa_name, en_name } = req.body;
  const q = 'INSERT INTO category (fa_name,en_name) VALUES (?,?)';
  db.query(q, [fa_name, en_name], (err, data) => {
    if (err) res.status(500).json({ message: 'addCategory error' });
    return res.status(200).json({ data: 'data added' });
  });
};

const getCategoryById = (req, res) => {
  const { id } = req.params;
  // TODO: get sub category
  const q =
    'SELECT c.*,s.id AS sub_category_id,s.fa_s_name,s.en_s_name FROM category AS c LEFT JOIN `sub-category` AS s ON (c.id = s.category_id)  WHERE c.id = ?';
  db.query(q, [id], (err, data) => {
    if (err)
      res.status(500).json({ message: 'getCategoryById error' });
    const category = {};
    data.forEach((row) => {
      if (!category[row.id]) {
        category[row.id] = {
          id: row.id,
          fa_name: row.fa_name,
          en_name: row.en_name,
          subs: []
        };
      }
      category[row.id].subs.push({
        id: row.sub_category_id,
        fa_s_name: row.fa_s_name,
        en_s_name: row.en_s_name
      });
    });
    return res.status(200).json({ data: Object.values(category)[0] });
  });
};

const updateCategory = (req,res) => {
  const {id} = req.params;
  const {fa_name,en_name} = req.body;
  const q = 'UPDATE category SET fa_name = ?,en_name = ? WHERE id = ?'
  db.query(q,[fa_name,en_name,id],(err,data) => {
    if(err) res.status(500).json({message: "updateCategory error"})
    return res.status(200).json({data: 'updated'})
  })
}

module.exports = { getAllCategories, addCategory, getCategoryById,updateCategory };
