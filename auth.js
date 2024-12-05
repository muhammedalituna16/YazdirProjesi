const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Access denied');
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).send('Invalid token');
    }
};
