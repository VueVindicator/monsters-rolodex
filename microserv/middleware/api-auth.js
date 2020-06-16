const jwt = require('jsonwebtoken');
const jwtSecretKey = 'somesupersecretsecret';

module.exports = (req, res, next) => {
    const token = req.cookies.token || '';
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, jwtSecretKey);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!token) {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    next();
}