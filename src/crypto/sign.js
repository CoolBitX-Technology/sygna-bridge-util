const secp256k1 = require('secp256k1')
const crypto = require('crypto')

/**
 * Sign utf-8 message with private message
 * @param {string} message
 * @param {string} privateKey
 * @return {string} signature
 */
exports.sign = (message, privateKey) => {
  const msgHash = crypto
    .createHash('sha256')
    .update(message, 'utf8')
    .digest()
  const sigObj = secp256k1.ecdsaSign(msgHash, Buffer.from(privateKey, 'hex'))
  return Buffer.from(sigObj.signature).toString('hex')
}

/**
 * Verify Message(utf-8) with signature and publicKey.
 * @param {string} message
 * @param {string} signature
 * @param {string} publicKey
 * @return {boolean}
 */
exports.verify = (message, signature, publicKey) => {
  const msgHash = crypto
    .createHash('sha256')
    .update(message, 'utf8')
    .digest()
  const normalizedSignature = secp256k1.signatureNormalize(Uint8Array.from(Buffer.from(signature, 'hex')))
  return secp256k1.ecdsaVerify(normalizedSignature, msgHash, Buffer.from(publicKey, 'hex'))
}