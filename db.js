const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mshgma6T',
    database: 'yazdir_veritabani'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Veritabanına başarıyla bağlanıldı');
});

module.exports = connection;
