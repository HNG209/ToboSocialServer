// Description: Controller for handling token validation requests
const { validateToken } = require('../services/tokenService');

const checkToken = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ valid: false, error: 'Token not provided' });
    }

    const result = validateToken(token);

    if (result.valid) {
        return res.status(200).json({ valid: true, payload: result.decoded });
    } else {
        return res.status(401).json({ valid: false, error: result.error });
    }
};

module.exports = {
    checkToken
};
