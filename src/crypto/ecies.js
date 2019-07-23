const crypto = require('crypto');
const Buffer = require('buffer').Buffer;

/**
 * Sygna Bridge ECIES Encode.
 * @param {string} msg text to encode (in utf-8 plain text)
 * @param {string} publicKey recipient's uncompressed publickey in hex form
 * @return {string} hex string of encoded private msg
 */
exports.ECIESEncode = (msg, publicKey) => {
  publicKey = Buffer.isBuffer(publicKey) ? publicKey : Buffer.from(publicKey, 'hex');
  msg = Buffer.from(msg);
  const ephemeral = crypto.createECDH('secp256k1');
  ephemeral.generateKeys();
  const sharedSecret = ephemeral.computeSecret(publicKey, null);
  const hashedSecret = sha512(sharedSecret, 'hex');
  const encryptionKey = hashedSecret.slice(0, 32);
  const macKey = hashedSecret.slice(32);
  let iv = Buffer.allocUnsafe(16);
  iv.fill(0);

  const ciphertext = aes256CbcEncrypt(iv, encryptionKey, msg);
  const dataToMac = Buffer.concat([iv, ephemeral.getPublicKey(), ciphertext]);
  const mac = hmacSha1(macKey, dataToMac);
  const encData = Buffer.concat([ephemeral.getPublicKey(), mac, ciphertext]);
  return encData.toString('hex');
};

/**
 * Sygna Bridge ECIES Decode.
 * @param {string} encodedMsg whole hex string encrypted by Sygna ECIES.
 * @param {string} privateKey
 */
exports.ECIESDecode = (encodedMsg, privateKey) => {
  privateKey = Buffer.isBuffer(privateKey) ? privateKey : Buffer.from(privateKey, 'hex');
  encodedMsg = Buffer.from(encodedMsg, 'hex');
  const ephemeralPubKey = encodedMsg.slice(0, 65);
  const mac = encodedMsg.slice(65, 85);  
  const ciphertext = encodedMsg.slice(85);
  const recipient = crypto.createECDH('secp256k1');
  recipient.setPrivateKey(privateKey);
  const sharedSecret = recipient.computeSecret(ephemeralPubKey, null);
  const hashedSecret = sha512(sharedSecret, 'hex');
  const encryptionKey = hashedSecret.slice(0, 32);
  const macKey = hashedSecret.slice(32);
  let iv = Buffer.alloc(16);
  iv.fill(0);
  const dataToMac = Buffer.concat([iv, ephemeralPubKey, ciphertext]);
  const realMac = hmacSha1(macKey, dataToMac);
  return bytesEqual(mac, realMac)?
    aes256CbcDecrypt(iv, encryptionKey, ciphertext).toString() : false;
};

const aes256CbcEncrypt = (iv, key, plaintext) => {
  let cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const firstChunk = cipher.update(plaintext);
  const secondChunk = cipher.final();
  return Buffer.concat([firstChunk, secondChunk]);
};

const aes256CbcDecrypt = (iv, key, ciphertext) => {
  let decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const firstChunk = decipher.update(ciphertext);
  const secondChunk = decipher.final();
  return Buffer.concat([firstChunk, secondChunk]);
};

const sha512 = (msg) => {
  return crypto.createHash("sha512").update(msg).digest();
};

const hmacSha1 = (key, msg) => {
  return crypto.createHmac("sha1", key).update(msg).digest();
};

const bytesEqual = (b1, b2) => {
  if (b1.length !== b2.length) { return false; }
  for (var i = 0; i < b1.length; i++){
    if (b1[i] ^ b2[i]) return false;
  }
  return true;
};
