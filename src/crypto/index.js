const ecies = require('./ecies');
const sygnaSign = require('./sign');

/**
 * Encrypt private info object to hex string.
 * @param {object} data priv_info in object format.
 * @param {string} publicKey recipeint public key in hex string.
 * @returns {string} ECIES encoded privMsg.
 */
exports.sygnaEncodePrivateObj = (data, publicKey) => {
    const msgString = JSON.stringify(data);
    const encoded = ecies.ECIESEncode(msgString, publicKey);
    return encoded;
};

/**
 * Decode private info from recipent server.
 * @param {string} privMsg 
 * @param {string} privateKey 
 * @returns {object}
 */
exports.sygnaDecodePrivateObg = (privMsg, privateKey) => {
    const decoded = ecies.ECIESDecode(privMsg, privateKey);
    return JSON.parse(decoded);
};

/**
 * Sign Objects.
 * @param {object} obj
 * @param {string} privateKey
 * @returns {string}
 */
exports.signObject = (obj, privateKey) => {
    const msgStr = JSON.stringify(obj);
    const signature = sygnaSign.sign(msgStr, privateKey);
    return signature.toString('hex');
};

/**
 * @param {object} obj
 * @param {string} publicKey
 * @param {string} signature
 * @returns {boolean}
 */
exports.verifyObject = (obj, publicKey, signature) => {
    const msgStr = JSON.stringify(obj);
    return sygnaSign.verify(msgStr, signature, publicKey);
};