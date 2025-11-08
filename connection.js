require('dotenv').config();
const mysql = require('mysql');

// ایجاد connection اصلی
let db;

function handleDisconnect() {
  db = mysql.createConnection({
    host: process.env.DB_HOST,       // مثلا 127.0.0.1
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  db.connect(err => {
    if (err) {
      console.error('DB connection error:', err);
      // تلاش مجدد بعد از 2 ثانیه
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('✅ DB connected');
    }
  });

  db.on('error', err => {
    console.error('DB error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('🔄 Reconnecting...');
      handleDisconnect(); // اتصال دوباره بساز
    } else {
      throw err;
    }
  });
}

// ایجاد اولین اتصال
handleDisconnect();

module.exports = db;
