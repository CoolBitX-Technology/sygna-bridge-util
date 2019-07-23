const secp256k1 = require('secp256k1');
const crypto = require("crypto");

/**
 * Sign utf-8 message with private message
 * @param {string} message
 * @param {string} privateKey
 * @returns {string} signature
 */
exports.sign = (message, privateKey) => {
    const msgHash = crypto.createHash('sha256').update(message, 'utf8').digest();
    const sigObj = secp256k1.sign(msgHash, Buffer.from(privateKey, 'hex'));
    return sigObj.signature.toString('hex');
};
  
/**
 * Verify Message(utf-8) with signature and publicKey.
 * @param {string} message
 * @param {string} signature
 * @param {string} publicKey
 * @returns {boolean}
 */
exports.verify = (message, signature, publicKey) => {
    const msgHash = crypto.createHash('sha256').update(message, 'utf8').digest();
    return secp256k1.verify(msgHash, Buffer.from(signature,'hex'), Buffer.from(publicKey,'hex'));
};