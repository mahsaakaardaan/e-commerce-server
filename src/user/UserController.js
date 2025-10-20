const db = require('../../connection');
const jwt = require('jsonwebtoken');

const updateProfile = (req, res) => {
  const id = req.userId;
  const updates = req.body;
  if (Object.keys(updates).length == 0) {
    return res.status(400).json({ message: 'no fields to update' });
  }
  const fields = Object.keys(updates)
    .map((field) => `${field} = ?`)
    .join(', ');
  const values = Object.values(updates);
  const q = `UPDATE user SET ${fields} WHERE user_id = ?`;
  values.push(id);
  db.query(q, values, (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'updateProfile error' + err });
    return res.status(200).json({ data: 'update' });
  });
  //   const { name, email, national_id } = req.body;
  //   const q =
  //     'UPDATE user SET name = ?,email = ?,national_id = ? WHERE user_id = ?';
  //   db.query(q, [name, email, national_id, id], (err, data) => {
  //     if (err)
  //       return res.status(500).json({ message: 'updateProfile error' });
  //     return res.status(200).json({ data: 'updated' });
  //   });
};

const AddAddress = (req, res) => {
  const user_id = req.userId;
  const {
    lat,
    lang,
    full_address,
    country,
    city,
    location,
    floor,
    unit,
    postal_code
  } = req.body;
  const is_default = 0;
  const q =
    'INSERT INTO address (user_id,lat,lang,full_address,country,city,location,floor,unit,postal_code,is_default) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
  db.query(
    q,
    [
      user_id,
      lat,
      lang,
      full_address,
      country,
      city,
      location,
      floor,
      unit,
      postal_code,
      is_default
    ],
    (err, data) => {
      if (err) {
        console.log('first', err);

        return res
          .status(500)
          .json({ message: 'add address error ' + err });
      }
      return res.status(200).json({ data: data.insertId });
    }
  );
};

const userAddresses = (req, res) => {
  const userId = req.userId;

  const q = 'SELECT * FROM address WHERE user_id = ?';
  db.query(q, [userId], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'userAddresses error' + err });
    return res.status(200).json({ data });
  });
};

const getAddressById = (req, res) => {
  const { addressId } = req.params;
  const userId = req.userId;
  const q =
    'SELECT * FROM address WHERE address_id = ? AND user_id = ?';
  db.query(q, [addressId, userId], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getAddressById error' + err });
    return res.status(200).json({ data });
  });
};

const updateAddressById = (req, res) => {
  const { addressId } = req.params;
  const updates = req.body;
  if (Object.keys(updates).length == 0) {
    return res.status(400).json({ message: 'no field changed' });
  }
  const fields = Object.keys(updates)
    .map((field) => `${field} = ?`)
    .join(', ');
  const values = Object.values(updates);
  const q = `UPDATE address SET ${fields} WHERE address_id = ?`;
  values.push(addressId);
  db.query(q, values, (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'update address error' + err });
    return res.status(200).json({ data });
  });
};

const deleteAddress = (req, res) => {
  const user_id = req.userId;
  const { address_id } = req.params;
  q = 'DELETE FROM address WHERE address_id = ? AND user_id = ?';
  db.query(q, [address_id, user_id], (error, data) => {
    if (error)
      return res
        .status(500)
        .json({ message: 'deleteAddress error' + error });
    return res.status(200).json({ data: 'success' });
  });
};

const setDefaultAddress = async (req, res) => {
  const user_id = req.userId;
  const { address_id } = req.body;
  const q = 'UPDATE address SET is_default = ? WHERE user_id = ?';
  const q2 =
    'UPDATE address SET is_default = ? WHERE user_id = ? AND address_id = ?';

  const q3 =
    'UPDATE user SET default_address_id = ? WHERE user_id = ?';
  db.query(q, [0, user_id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'setDefaultAddress q1 error' + err });
    db.query(q2, [1, user_id, address_id], (err2, data2) => {
      if (err2)
        return res
          .status(500)
          .json({ message: 'setDefaultAddress q2 error' + err2 });
      db.query(q3, [address_id, user_id], (err3, data3) => {
        if (err3)
          return res
            .status(500)
            .json({ message: 'err3 in setDefaultAddress' + err3 });
        return res.status(200).json({ message: 'success' });
      });
    });
  });
};

const getUserByToken = async (req, res) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.JWT);
  const userId = decoded.id;

  const q =
    'SELECT u.*,a.* FROM user AS u LEFT JOIN address AS a ON (a.address_id = u.default_address_id) WHERE u.user_id = ? ';
  db.query(q, [userId], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getUserByToken error' + err });

    return res.status(200).json({ data: data[0] });
  });
};

module.exports = {
  updateProfile,
  AddAddress,
  userAddresses,
  getAddressById,
  updateAddressById,
  deleteAddress,
  setDefaultAddress,
  getUserByToken
};
