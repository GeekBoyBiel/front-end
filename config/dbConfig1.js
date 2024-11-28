const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: '191.101.232.42',
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBASE,
    connectTimeout: 10000
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao MySQL');
});

module.exports = db;
