const crypto = require('./src/crypto');
const API = require('./src/api').API;
const config = require('./src/config');
const validateSchemaModule = require('./src/utils/validateSchema');

module.exports = {
    API,
    crypto,
    config,
    ...validateSchemaModule
};