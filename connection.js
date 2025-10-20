require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.HOST,
  user: 'root',
  password: 'root',
  database: process.env.DATA_BASE,
  port: process.env.DB_PORT_2,
  multipleStatements: true
});

db.connect((err) => { 
  if (err) console.log('connection error', err); 
  console.log('db connected', db.state);
});

module.exports = db; 
