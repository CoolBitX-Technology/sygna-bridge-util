const ecies = require('./ecies');
const sygnaSign = require('./sign');

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
exports.sygnaDecodePrivateObg = (privMsg, privateKey) => {
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
exports.signTransferData = (private_info, transaction, data_dt, privateKey) => {
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
    let data = {
        callback_url,
    };
    return this.signObject(data, privateKey);
};

/**
 * @param {string} transfer_id
 * @param {string} result REJECT or ACCEPT
 * @param {string} privateKey
 * @return {{transfer_id:string, result: string, signature: string}}
 */
exports.signResult = (transfer_id, result, privateKey) => {
    let data = {
        transfer_id,
        result
    };
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
 * @param {object} obj
 * @param {string} publicKey
 * @return {boolean}
 */
exports.verifyObject = (obj, publicKey) => {
    const { signature } = obj;
    obj.signature = "";
    const msgStr = JSON.stringify(obj);
    return sygnaSign.verify(msgStr, signature, publicKey);
};