const express = require('express');
const {
  createOrder,
  createCurrentOrder,
  getCurrentOrders,
  addToCard,
  submitOrder,
  getAllOrders,
  getOrderById,
  deleteCurrentOrder,
  countCurrentOrder,
  getAllOrdersForAdmin,
  changeOrderStatus
} = require('./ShipmentController');
const { auth } = require('../../middleware/auth');

const router = express.Router();

router.post('/add', auth, createOrder);
router.post('/order', auth, createCurrentOrder);

// shipping

router.post('/add-to-card', auth, addToCard);
router.get('/current-orders', auth, getCurrentOrders);
router.post('/submit-order', auth, submitOrder);
router.get('/get-all-orders', auth, getAllOrders);
router.get('/order/:orderId', auth, getOrderById);
router.delete(
  '/delete-current-order/:currentOrderId',
  auth,
  deleteCurrentOrder
);

router.patch('/count', auth, countCurrentOrder);

// ADMIN

router.get('/admin-orders', auth, getAllOrdersForAdmin);
router.patch('/change-order-status', auth, changeOrderStatus);

module.exports = router;
