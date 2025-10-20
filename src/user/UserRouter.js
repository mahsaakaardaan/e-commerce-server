const express = require('express');
const {
  updateProfile,
  AddAddress,
  userAddresses,
  getAddressById,
  updateAddressById,
  deleteAddress,
  setDefaultAddress,
  getUserByToken
} = require('./UserController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.patch('/update', auth, updateProfile);
router.post('/address/new', auth, AddAddress);
router.get('/addresses', auth, userAddresses);
router.get('/address/:addressId', auth, getAddressById);
router.patch('/address/update/:addressId', auth, updateAddressById); 
router.delete('/address/delete/:address_id', auth, deleteAddress);
router.post('/address/set-default', auth, setDefaultAddress);
router.get('/get-user/:token', auth, getUserByToken);

module.exports = router;
