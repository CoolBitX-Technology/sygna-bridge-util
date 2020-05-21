const ecies = require('./ecies');
const sygnaSign = require('./sign');
const { SYGNA_BRIDGE_CENTRAL_PUBKEY, REJECTED } = require('../config');
const { validatePrivateKey } = require('../utils');

/**
 * Encrypt private info object to hex string.
 * @param {object|string} data priv_info in object or string format.
 * @param {string} publicKey recipeint public key in hex string.
 * @return {string} ECIES encoded privMsg.
 */
exports.sygnaEncodePrivateObj = (data, publicKey) => {
  let msgString = data;
  if (typeof data === 'object') {
    msgString = JSON.stringify(data);
  }
  const encoded = ecies.ECIESEncode(msgString, publicKey);
  return encoded;
};

/**
 * Decode private info from recipent server.
 * @param {string} privMsg
 * @param {string} privateKey
 * @return {object}
 */
exports.sygnaDecodePrivateObj = (privMsg, privateKey) => {
  const decoded = ecies.ECIESDecode(privMsg, privateKey);
  try {
    return JSON.parse(decoded);
  } catch (error) {
    return decoded;
  }
};

/**
 * @param {{private_info: string, transaction:object, data_dt:string, expire_date?:number}} data
 * @param {string} privateKey
 * @return {{private_info: string, transaction:{}, data_dt:string, signature:string, expire_date?:number}}
 */
exports.signPermissionRequest = (data, privateKey) => {
  validatePrivateKey(privateKey);
  return this.signObject(data, privateKey);
};

/**
 * @param {{callback_url:string}} data
 * @param {string} privateKey
 * @return {{callback_url, signature: string}}
 */
exports.signCallBack = (data, privateKey) => {
  validatePrivateKey(privateKey);
  return this.signObject(data, privateKey);
};

/**
 * @param {{transfer_id:string, permission_status:REJECTED | ACCEPTED, expire_date?:number, reject_code?:string, reject_message?:string}} data
 * @param {string} privateKey
 * @return {{transfer_id:string, permission_status:REJECTED| ACCEPTED, signature: string, expire_date?:number, reject_code?:string, reject_message?:string}}}
 */
exports.signPermission = (data, privateKey) => {
  validatePrivateKey(privateKey);
  return this.signObject(data, privateKey);
};

/**
 * @param {{transfer_id:string, txid:string}} data
 * @param {string} privateKey
 * @return {{transfer_id:string, txid:string, signature:string}}
 */
exports.signTxId = (data, privateKey) => {
  validatePrivateKey(privateKey);
  return this.signObject(data, privateKey);
};

/**
 * Sign Objects.
 * @param {object} obj
 * @param {string} privateKey
 * @return {object} original object adding a signature field
 */
exports.signObject = (obj, privateKey) => {
  obj.signature = '';
  const msgStr = JSON.stringify(obj);
  const signature = sygnaSign.sign(msgStr, privateKey);
  obj.signature = signature.toString('hex');
  return obj;
};

/**
 * verify obj with provided pubkey or default sygna bridge publickey
 * @param {object} obj
 * @param {string?} publicKey default to sygna bridge's publickey
 * @return {boolean}
 */
exports.verifyObject = (obj, publicKey = SYGNA_BRIDGE_CENTRAL_PUBKEY) => {
  const clone = Object.assign({}, obj);
  const { signature } = clone;
  clone.signature = '';
  const msgStr = JSON.stringify(clone);
  return sygnaSign.verify(msgStr, signature, publicKey);
};

/**
 * @param {{vasp_code:string,callback_permission_request_url?:string,callback_txid_url?:string}} data
 * @param {string} privateKey
 * @return {{vasp_code:string,callback_permission_request_url?:string,,callback_txid_url?:string,signature:string}}
 */
exports.signBeneficiaryEndpointUrl = (data, privateKey) => {
  validatePrivateKey(privateKey);
  return this.signObject(data, privateKey);
};
