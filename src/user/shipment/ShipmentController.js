const db = require('../../../connection');

const createOrder = (req, res) => {
  const { user_id, product_id, price_is, variant_id, address_id } =
    req.body;
  const status = 'pending';
  const total_amount = 3;
  const quantity = 3;
  const q =
    'INSERT INTO `orders` (user_id,status,address_id,total_amount) VALUES (?,?,?,?)';
  db.query(
    q,
    [user_id, status, address_id, total_amount],
    (err, data) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'insert order error' + err });
      const q2 =
        'INSERT INTO `order-item` (order_id,product_id,price_is,variant_id,quantity) VALUES (?,?,?,?,?)';
      db.query(
        q2,
        [data.insertId, product_id, price_is, variant_id, quantity],
        (err2, data2) => {
          if (err2)
            return res
              .status(500)
              .json({ message: 'order item error' + err2 });
          return res.status(200).json('hello');
        }
      );
    }
  );
};

const createCurrentOrder = (req, res) => {
  const {
    user_id,
    product_id,
    quantity,
    added_at,
    address_id,
    variant_id
  } = req.body;

  const q =
    'INSERT INTO `current-orders` (user_id,product_id,quantity,added_at,address_id,variant_id) VALUES (?,?,?,?,?,?)';
  db.query(
    q,
    [user_id, product_id, 1, 5, address_id, variant_id],
    (err, data) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'createCurrentOrder error' });
      return res.status(200).json({ data: 'added ok' });
    }
  );
};

const getCurrentOrders = (req, res) => {
  const user_id = req.userId;
  const q =
    'SELECT c.*,p.*,cv.color,cv.hex,cv.price FROM `current-orders` AS c LEFT JOIN product AS p ON (c.product_id = p.id) LEFT JOIN `color-variant` AS cv ON (c.variant_id = cv.id) WHERE user_id = ?';
  db.query(q, [user_id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getCurrentOrders error' + err });

    const result = data?.map((row) => ({
      current_order_id: row.current_order_id,
      added_at: row.added_at,
      product_id: row.product_id,
      user_id: row.user_id,
      quantity: row.quantity,
      address_id: row.address_id,
      variant_id: row.variant_id,
      color: row.color,
      hex: row.hex,
      price: row.price,
      product: {
        id: row.product_id,
        title: row.title,
        description: row.description,
        thumbnail: row.thumbnail,
        product_category_id: row.product_category_id,
        product_sub_id: row.product_sub_id,
        off: row.off,
        variants: [
          {
            id: row.variant_id,
            color: row.color,
            hex: row.hex,
            price: row.price
          }
        ]
      }
    }));
    return res.status(200).json({ data: result });
  });
};

const deleteCurrentOrder = (req, res) => {
  const user_id = req.userId;
  const { currentOrderId } = req.params;
  const q =
    'DELETE FROM `current-orders` WHERE current_order_id = ? AND user_id = ?';
  db.query(q, [currentOrderId, user_id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'deleteCurrentOrder error' + err });
    return res.status(200).json({ data: 'success' });
  });
};

const countCurrentOrder = (req, res) => {
  const user_id = req.userId;
  const { current_order_id, quantity } = req.body;
  const q =
    'UPDATE `current-orders` SET quantity = ? WHERE current_order_id = ? AND user_id = ?';
  const q2 = 'UPDATE `color-variant` SET count = ? WHERE id = ?';
  db.query(q, [quantity, current_order_id, user_id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'countCurrentOrder error' + err });
    // const count = data.quantity - quantity;

    db.query(q2, [quantity, data.variant_id], (err2, data2) => {
      if (err2)
        return res
          .status(500)
          .json({ message: 'countCurrentOrder error2' + err });
      return res.status(200).json({ data: 'success' });
    });
  });
};

const addToCard = (req, res) => {
  const user_id = req.userId;
  const { product_id, quantity, variant_id, address_id } = req.body;
  const q =
    'INSERT INTO `current-orders` (user_id,product_id,quantity,variant_id,address_id) VALUES (?,?,?,?,?)';
  db.query(
    q,
    [user_id, product_id, 1, variant_id, 3],
    (err, data) => {
      if (err)
        return (
          res.status(500),
          json({ message: 'addToCard error in shipment' + err })
        );
      return res.status(200).json({ data: 'addToCard success' });
    }
  );
};

const submitOrder = (req, res) => {
  // products => [order_id,product_id,quantity,price_is,variant_id]
  const user_id = req.userId;
  const { status, total_amount, products } = req.body;
  const q4 = 'SELECT default_address_id FROM user WHERE user_id = ?';

  db.query(q4, [user_id], (err4, data4) => {
    if (err4)
      return res
        .status(500)
        .json({ message: 'submitOrder error4' + err4 });
    const user = data4[0];
    if (!user.default_address_id) {
      return res.status(403).json({
        redirectTo: '/profile/add-address'
      });
    } else {
      const q =
        'INSERT INTO `orders` (user_id,status,total_amount,address_id) VALUES (?,?,?,?)';
      db.query(
        q,
        [user_id, 'pending', 3, user.default_address_id],
        (err, data) => {
          if (err) {
            return res
              .status(500)
              .json({ message: 'submitOrder error' + err });
          }
          if (products.length !== 0) {
            const values = products.map((item) => [
              data.insertId,
              item.product_id,
              item.quantity,
              item.price_is,
              item.variant_id
            ]);

            const q2 =
              'INSERT INTO `order-item` (order_id,product_id,quantity,price_is,variant_id) VALUES ?';
            db.query(q2, [values], (err2, data2) => {
              if (err2)
                return res
                  .status(500)
                  .json({ message: 'submitOrder err2' + err2 });

              const q3 =
                'DELETE FROM `current-orders` WHERE user_id = ?';
              db.query(q3, [user_id], (err3, data3) => {
                if (err3)
                  return res.status(500).json({
                    message: 'delete current orders error' + err3
                  });
              });
              return res.status(200).json({ data: 'success' });
            });
          }
        }
      );
    }
  });
};

const getAllOrders = (req, res) => {
  const { status } = req.query;
  const user_id = req.userId;
  const q =
    'SELECT o.*,oi.*,p.* FROM orders AS o LEFT JOIN `order-item` AS oi ON (o.order_id = oi.order_id) LEFT JOIN product AS p ON (p.id = oi.product_id) WHERE user_id = ? AND o.status = ?';
  db.query(q, [user_id, status], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getAllOrders error' + err });

    const detailOrder = {};
    data.forEach((row) => {
      if (!detailOrder[row.order_id]) {
        detailOrder[row.order_id] = {
          order_id: row.order_id,
          user_id: row.user_id,
          order_date: row.order_date,
          status: row.status,
          total_amount: row.total_amount,
          address_id: row.address_id,
          order_items: []
        };
      }
      detailOrder[row.order_id].order_items.push({
        order_item_id: row.order_item_id,
        order_id: row.order_id,
        product_id: row.product_id,
        quantity: row.quantity,
        price_is: row.price_is,
        variant_id: row.variant_id,
        order_product: {
          id: row.id,
          title: row.title,
          description: row.description,
          thumbnail: row.thumbnail,
          off: row.off
        }
      });
    });

    return res.status(200).json({ data: Object.values(detailOrder) });
  });
};

const getOrderById = (req, res) => {
  const user_id = req.userId;
  const { orderId } = req.params;
  const q =
    'SELECT o.*,oi.*,p.*,v.id AS variant_id,v.color AS color,v.hex AS hex,v.price AS variant_price,ad.* FROM orders AS o LEFT JOIN `order-item` AS oi ON (o.order_id = oi.order_id) LEFT JOIN product AS p ON (p.id = oi.product_id) LEFT JOIN `color-variant` AS v ON (oi.variant_id = v.id) LEFT JOIN address AS ad ON (o.address_id = ad.address_id) WHERE o.order_id = ?';
  db.query(q, [orderId], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getAllOrders error' + err });

    const detailOrder = {};
    data.forEach((row) => {
      if (!detailOrder[row.order_id]) {
        detailOrder[row.order_id] = {
          order_id: row.order_id,
          user_id: row.user_id,
          order_date: row.order_date,
          status: row.status,
          total_amount: row.total_amount,
          address_id: row.address_id,
          address: {
            address_id: row.address_id,
            full_address: row.full_address
          },
          order_items: []
        };
      }
      detailOrder[row.order_id].order_items.push({
        order_item_id: row.order_item_id,
        order_id: row.order_id,
        product_id: row.product_id,
        quantity: row.quantity,
        price_is: row.price_is,
        variant_id: row.variant_id,
        order_variant: {
          variant_id: row.variant_id,
          color: row.color,
          hex: row.hex,
          price: row.variant_price
        },
        order_product: {
          id: row.id,
          title: row.title,
          description: row.description,
          thumbnail: row.thumbnail,
          off: row.off
        }
      });
    });

    return res.status(200).json({ data: Object.values(detailOrder) });
  });
};

const getAllOrdersForAdmin = (req, res) => {
  const { status } = req.query;
  const q =
    'SELECT o.*,oi.*,p.* FROM orders AS o LEFT JOIN `order-item` AS oi ON (o.order_id = oi.order_id) LEFT JOIN product AS p ON (p.id = oi.product_id) WHERE o.status = ?';
  db.query(q, [status], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'getAllOrdersForAdmin error' + err });
    const detailOrder = {};
    data.forEach((row) => {
      if (!detailOrder[row.order_id]) {
        detailOrder[row.order_id] = {
          order_id: row.order_id,
          user_id: row.user_id,
          order_date: row.order_date,
          status: row.status,
          total_amount: row.total_amount,
          address_id: row.address_id,
          order_items: []
        };
      }
      detailOrder[row.order_id].order_items.push({
        order_item_id: row.order_item_id,
        order_id: row.order_id,
        product_id: row.product_id,
        quantity: row.quantity,
        price_is: row.price_is,
        variant_id: row.variant_id,
        order_product: {
          id: row.id,
          title: row.title,
          description: row.description,
          thumbnail: row.thumbnail,
          off: row.off
        }
      });
    });

    return res.status(200).json({ data: Object.values(detailOrder) });
  });
};

const changeOrderStatus = (req, res) => {
  const { status, order_id } = req.body;
  const q = 'UPDATE orders SET status = ? WHERE order_id = ?';
  db.query(q, [status, order_id], (err, data) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'changeOrderStatus error' + err });
    return res.status(200).json({ data: 'success' });
  });
};

module.exports = {
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
};
