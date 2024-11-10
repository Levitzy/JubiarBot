// adminCheck.js
const config = require('../config.json');

function isAdmin(userId) {
    return config.adminIds.includes(userId);
}

module.exports = { isAdmin };
