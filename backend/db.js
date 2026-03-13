const mysql = require('mysql2');
require('dotenv').config();

// 建立連線池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 匯出 promise 版本的連線池 (這很重要，讓你可以用 await)
module.exports = pool.promise();