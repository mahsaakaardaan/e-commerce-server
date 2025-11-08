require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({
  // host: process.env.HOST,
  // user: 'moonio_mahsaa',
  // password: '123456789',
  // database: process.env.DATA_BASE,
  // port: process.env.DB_PORT_2,
  // multipleStatements: true
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.PORT,
  multipleStatements: true

  // host: '46.34.163.193',
  // user: 'mahsa_node',
  // password: 'StrongPass123',
  // database:'ecommerce',
  // // port: process.env.DB_PORT_2,
  // multipleStatements: true
});

db.connect((err) => { 
  if (err) console.log('connection error', err); 
  console.log('db connected', db.state);
});

module.exports = db; 
