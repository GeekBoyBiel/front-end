const mysql = require('mysql2/promise');
require('dotenv').config();

const db2 = mysql.createPool({
    connectionLimit: 10, // Ajuste o limite de conexões conforme necessário
    host: '191.101.232.42',
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBASE,
    decimalNumbers: true,
});

module.exports = db2;
