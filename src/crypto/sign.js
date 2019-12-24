const secp256k1 = require('secp256k1')
const crypto = require('crypto')
const BN = require('bn.js');

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
  const sigObj = secp256k1.sign(msgHash, Buffer.from(privateKey, 'hex'))
  return sigObj.signature.toString('hex')
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
  const canonical_signature = getCanonicalSignature(signature)
  return secp256k1.verify(msgHash, Buffer.from(canonical_signature, 'hex'), Buffer.from(publicKey, 'hex'))
} 

/**
 * 
 * @param {string} signature 
 * @return {string} canonical signature
 */
function getCanonicalSignature(signature) {
  const modulusString = 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141'
  const modulus = new BN(modulusString, 16)
  const s = new BN(signature.slice(64), 16)
  const r = new BN(signature.slice(0,64), 16)
  const T = modulus.sub(s)
  let canonicalS = s.ucmp(T) < 0
    ? s.toString(16) 
    : T.toString(16)
 
  const sLength = canonicalS.length % 2 == 0 ? canonicalS.length : canonicalS.length + 1
  canonicalS = canonicalS.padStart(sLength, '0')
  
  const rHex = r.toString(16)
  const rLength = rHex.length % 2 == 0 ? rHex.length : rHex.length + 1
  let canonicalR = rHex.padStart(rLength, '0')
  
  const canonicalSignature = canonicalR + canonicalS
  return canonicalSignature
}
