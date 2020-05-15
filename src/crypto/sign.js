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
  const msgHashUint8Array = Uint8Array.from(msgHash)
  const privKeyUint8Array = Uint8Array.from(Buffer.from(privateKey, 'hex'))
  const sigObj = secp256k1.ecdsaSign(msgHashUint8Array, privKeyUint8Array)
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
  const msgHashUint8Array = Uint8Array.from(msgHash)
  const signatureUint8Array = Uint8Array.from(Buffer.from(signature, 'hex'))
  const normalizedSignature = secp256k1.signatureNormalize(signatureUint8Array)
  const pubKeyUint8Array = Uint8Array.from(Buffer.from(publicKey, 'hex'))

  return secp256k1.ecdsaVerify(normalizedSignature, msgHashUint8Array, pubKeyUint8Array)
}