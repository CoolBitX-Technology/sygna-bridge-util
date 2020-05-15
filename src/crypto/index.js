const ecies = require('./ecies');
const sygnaSign = require('./sign');
const { SYGNA_BRIDGE_CENTRAL_PUBKEY, REJECTED } = require('../config');
const {
  validateTxIdSchema,
  validateCallbackSchema,
  validatePermissionSchema,
  validatePermissionRequestSchema,
  validatePrivateKey,
  sortCallbackData,
  sortTxIdData,
  sortPermissionData,
  sortPermissionRequestData,
  validateBeneficiaryEndpointUrlSchema,
  sortBeneficiaryEndpointUrlData,
} = require('../utils');

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
  const valid = validatePermissionRequestSchema(data);
  if (!valid[0]) {
    throw valid[1];
  }
  validatePrivateKey(privateKey);
  const sortedData = sortPermissionRequestData(data);
  return this.signObject(sortedData, privateKey);
};

/**
 * @param {{callback_url:string}} data
 * @param {string} privateKey
 * @return {{callback_url, signature: string}}
 */
exports.signCallBack = (data, privateKey) => {
  const valid = validateCallbackSchema(data);
  if (!valid[0]) {
    throw valid[1];
  }
  validatePrivateKey(privateKey);

  const sortedData = sortCallbackData(data);
  return this.signObject(sortedData, privateKey);
};

/**
 * @param {{transfer_id:string, permission_status:REJECTED | ACCEPTED, expire_date?:number, reject_code?:string, reject_message?:string}} data
 * @param {string} privateKey
 * @return {{transfer_id:string, permission_status:REJECTED| ACCEPTED, signature: string, expire_date?:number, reject_code?:string, reject_message?:string}}}
 */
exports.signPermission = (data, privateKey) => {
  const valid = validatePermissionSchema(data);
  if (!valid[0]) {
    throw valid[1];
  }
  validatePrivateKey(privateKey);

  const sortedData = sortPermissionData(data);
  return this.signObject(sortedData, privateKey);
};

/**
 * @param {{transfer_id:string, txid:string}} data
 * @param {string} privateKey
 * @return {{transfer_id:string, txid:string, signature:string}}
 */
exports.signTxId = (data, privateKey) => {
  const valid = validateTxIdSchema(data);
  if (!valid[0]) {
    throw valid[1];
  }
  validatePrivateKey(privateKey);

  const sortedData = sortTxIdData(data);
  return this.signObject(sortedData, privateKey);
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
  const valid = validateBeneficiaryEndpointUrlSchema(data);
  if (!valid[0]) {
    throw valid[1];
  }
  validatePrivateKey(privateKey);

  const sortedData = sortBeneficiaryEndpointUrlData(data);
  return this.signObject(sortedData, privateKey);
};
