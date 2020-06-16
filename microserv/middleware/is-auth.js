const jwt = require('jsonwebtoken');
const jwtSecretKey = 'somesupersecretsecret';

module.exports = (req, res, next) => {
    const token = req.cookies.token || '';
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, jwtSecretKey);
    } catch (err) {
        return res.redirect('/login');
    }

    if (!token) {
        res.redirect('/login');
    }

    req.userId = decodedToken.userId;
    console.log(req.userId);
    next();
}