const ecies = require('./ecies');
const sygnaSign = require('./sign');
const { SYGNA_BRIDGE_CENTRAL_PUBKEY } = require('../config');

/**
 * Encrypt private info object to hex string.
 * @param {object} data priv_info in object format.
 * @param {string} publicKey recipeint public key in hex string.
 * @return {string} ECIES encoded privMsg.
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
 * @return {object}
 */
exports.sygnaDecodePrivateObj = (privMsg, privateKey) => {
    const decoded = ecies.ECIESDecode(privMsg, privateKey);
    return JSON.parse(decoded);
};

/**
 * @param {string} private_info
 * @param {object} transaction
 * @param {string} data_dt
 * @param {string} privateKey
 * @return {{private_info: string, transaction:{}, data_dt:string, signature:string}}
 */
exports.signPermissionRequest = (private_info, transaction, data_dt, privateKey) => {
    if (typeof private_info !== "string") throw new Error(`private_info should be string, got ${typeof private_info}`);
    if (typeof data_dt !== "string") throw new Error(`data_dt should be string, got ${typeof data_dt}`);
    if (typeof privateKey !== "string") throw new Error(`privateKey should be string, got ${typeof privateKey}`);
    if (!Array.isArray(transaction.beneficiary_addrs)) throw new Error(`transaction.beneficiary_addrs should be array, got ${typeof transaction.beneficiary_addrs}`);
    if (!Array.isArray(transaction.originator_addrs)) throw new Error(`transaction.originator_addrs should be array, got ${typeof transaction.originator_addrs}`);
    if (typeof transaction.originator_vasp_code !== "string") throw new Error(`transaction.originator_vasp_code should be string, got ${typeof transaction.originator_vasp_code}`);
    if (typeof transaction.beneficiary_vasp_code !== "string") throw new Error(`transaction.beneficiary_vasp_code should be string, got ${typeof transaction.beneficiary_vasp_code}`);
    if (typeof transaction.transaction_currency !== "string") throw new Error(`transaction.transaction_currency should be string, got ${typeof transaction.transaction_currency}`);
    if (typeof transaction.amount !== "number") throw new Error(`transaction.amount should be number, got ${typeof transaction.amount}`);
    
    let data = {
        private_info,
        transaction,
        data_dt
    };
    return this.signObject(data, privateKey);
};

/**
 * @param {string} callback_url
 * @param {string} privateKey
 * @return {{callback_url_string, signature: string}}
 */
exports.signCallBack = (callback_url, privateKey) => {
    if (typeof callback_url !== "string") throw new Error(`callback_url should be string, got ${typeof callback_url}`);
    if (typeof privateKey !== "string") throw new Error(`privateKey should be string, got ${typeof privateKey}`);
    let data = {
        callback_url,
    };
    return this.signObject(data, privateKey);
};

/**
 * @param {string} transfer_id
 * @param {string} permission_status REJECT or ACCEPT
 * @param {string} privateKey
 * @return {{transfer_id:string, permission_status: string, signature: string}}
 */
exports.signPermission = (transfer_id, permission_status, privateKey) => {
    if (typeof transfer_id !== "string") throw new Error(`transfer_id should be string, got ${typeof transfer_id}`);
    if (typeof permission_status !== "string") throw new Error(`permission_status should be string, got ${typeof permission_status}`);
    if (typeof privateKey !== "string") throw new Error(`privateKey should be string, got ${typeof privateKey}`);
    let data = {
        transfer_id,
        permission_status
    };
    return this.signObject(data, privateKey);
};

/**
 * @param {string} transfer_id
 * @param {string} txid
 * @param {string} privateKey
 * @return {{transfer_id:string, txid:string, signature:string}}
 */
exports.signTxId = (transfer_id, txid, privateKey) => {
    if (typeof transfer_id !== "string") throw new Error(`transfer_id should be string, got ${typeof transfer_id}`);
    if (typeof txid !== "string") throw new Error(`txid should be string, got ${typeof txid}`);
    if (typeof privateKey !== "string") throw new Error(`privateKey should be string, got ${typeof privateKey}`);
    let data = { transfer_id, txid };
    return this.signObject(data, privateKey);
};

/**
 * Sign Objects.
 * @param {object} obj
 * @param {string} privateKey
 * @return {object} original object adding a signature field
 */
exports.signObject = (obj, privateKey) => {
    obj.signature = "";
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
exports.verifyObject = (obj, publicKey=SYGNA_BRIDGE_CENTRAL_PUBKEY) => {
    const clone = Object.assign({}, obj);
    const { signature } = clone;
    clone.signature = "";
    const msgStr = JSON.stringify(clone);
    return sygnaSign.verify(msgStr, signature, publicKey);
};