const nconf = require('nconf');
const path = require('path');

module.exports = function () {
    return nconf
        .argv()
        .env()
        .file('products', path.join(__dirname, 'products.json'))
        .file('skills', path.join(__dirname, 'skills.json'))
        .file('login', path.join(__dirname, 'login.json'))
}