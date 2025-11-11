const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  'http://46.34.163.193:4500'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies / auth headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    'http://46.34.163.193:4500'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  next();
});
app.use(cookieParser());

app.use('/category', require('./src/category/categoryRouter.js'));
app.use(
  '/sub-category',
  require('./src/sub-category/subCategoryRouter.js')
);
app.use('/product', require('./src/product/productRouter.js'));

app.use('/auth', require('./src/user/AuthRouter.js'));

app.use('/user', require('./src/user/UserRouter.js'));

app.use(
  '/shipment',
  require('./src/user/shipment/ShipmentRouter.js')
);

app.use('/comment', require('./src/comments/commentsRouter.js'));

app.listen(3335, () => console.log('app is running')); 
