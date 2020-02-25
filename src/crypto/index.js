const ecies = require('./ecies');
const sygnaSign = require('./sign');
const { SYGNA_BRIDGE_CENTRAL_PUBKEY, REJECTED } = require('../config');
const { checkExpireDateValid, checkPermissionStatus, checkRejectDataValid } = require('../api/check')
const {
    validateTxIdSchema,
    validateCallbackSchema,
    validatePermissionSchema,
    validatePermissionRequestSchema
} = require('../utils/validateSchema');
const {
    validatePrivateKey
} = require('../utils/validatePrivateKey')

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

    const {
        private_info,
        transaction,
        data_dt,
        expire_date
    } = data;

    const dataToSign = {
        private_info,
        transaction,
        data_dt
    };
    if (expire_date) {
        dataToSign.expire_date = expire_date;
    }
    return this.signObject(dataToSign, privateKey);
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

    const dataToSign = {
        callback_url: data.callback_url,
    };
    return this.signObject(dataToSign, privateKey);
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

    const {
        transfer_id,
        permission_status,
        expire_date,
        reject_code,
        reject_message
    } = data;

    const dataToSign = {
        transfer_id,
        permission_status

    };
    if (expire_date) {
        dataToSign.expire_date = expire_date;
    }
    if (permission_status === REJECTED) {
        dataToSign.reject_code = reject_code;
        dataToSign.reject_message = reject_message;
    }
    return this.signObject(dataToSign, privateKey);
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

    const dataToSign = { transfer_id: data.transfer_id, txid: data.txid };
    return this.signObject(dataToSign, privateKey);
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
exports.verifyObject = (obj, publicKey = SYGNA_BRIDGE_CENTRAL_PUBKEY) => {
    const clone = Object.assign({}, obj);
    const { signature } = clone;
    clone.signature = "";
    const msgStr = JSON.stringify(clone);
    return sygnaSign.verify(msgStr, signature, publicKey);
};