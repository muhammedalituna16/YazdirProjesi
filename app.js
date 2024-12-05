const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Veritabanı bağlantısı
const auth = require('./auth'); // Kimlik doğrulama middleware'i

const app = express();

const JWT_SECRET = 'your_secret_key';

require('dotenv').config();
const db = mysql.createConnection({
    host: process.env.localhost,
    user: process.env.root,
    password: process.env.mshgma6T,
    database: process.env.yazdir_veritabani,
});


app.use(cors());
app.use(bodyParser.json());

// Kullanıcı Girişi (Login)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) return res.status(500).send('Database error');
        if (results.length === 0) return res.status(401).send('Invalid email or password');
        const token = jwt.sign({ userId: results[0].id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Kullanıcıları Listeleme (JWT Koruması ile)
app.get('/users', auth, (req, res) => {
    const userId = req.user.userId; // JWT'den alınan userId
    db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) return res.status(500).send('Error fetching users');
        res.json(results);
    });
});

// Yeni Kullanıcı Ekleme
app.post('/add-user', (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!email.includes('@') || phone.length < 3) {
        return res.status(400).send('Invalid data');
    }
    db.query('INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)', [name, email, phone, password], (err) => {
        if (err) return res.status(500).send('Error adding user');
        res.send('User added successfully!');
    });
});

// Kargo Şirketlerini Listeleme
app.get('/companies', auth, (req, res) => {
    db.query('SELECT * FROM companies', (err, results) => {
        if (err) return res.status(500).send('Error fetching companies');
        res.json(results);
    });
});

// Yeni Kargo Şirketi Ekleme
app.post('/add-company', auth, (req, res) => {
    const { company_name, service_type, price } = req.body;
    db.query('INSERT INTO companies (company_name, service_type, price) VALUES (?, ?, ?)', [company_name, service_type, price], (err) => {
        if (err) return res.status(500).send('Error adding company');
        res.send('Company added successfully!');
    });
});

// Sunucu Başlatma
app.listen(3000, () => {
    console.log('Sunucu 3000 portunda çalışıyor');
});
