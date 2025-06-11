// This service provides a function to validate JWT tokens.
const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, error: err.message };
    }
};

module.exports = {
    validateToken
};