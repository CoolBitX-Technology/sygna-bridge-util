const request = require('./request');

/**
 * Notify Sygna Bridge that you have confirmed specific transfer from other VASP.
 * Should be called by Beneficiary Server
 * @param {string} callback_url 
 * @param {{transfer_id:string, beneficiary_signature:string, result:string}} params 
 * @return {Promise<boolean>}
 */
async function callBackConfirmNotification(callback_url, api_key, params) {
    const url = callback_url + '/v1/confirm-notification';
    const headers = { "api-key": api_key };
    await request.postSygnaBridge(url, headers, params);
}

module.exports = {
    callBackConfirmNotification
};