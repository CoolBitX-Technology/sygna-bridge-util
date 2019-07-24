const request = require('./request');

/**
 * Notify Sygna Bridge that you have confirmed specific transfer from other VASP.
 * Should be called by Beneficiary Server
 * @param {string} sygnaBridgeDomain 
 * @param {string} transfer_id
 * @param {string} beneficiary_signature
 * @param {string} result
 * @return {Promise}
 */
async function callBackConfirmNotification(sygnaBridgeDomain, api_key, transfer_id, result, beneficiary_signature) {
    const url = sygnaBridgeDomain + '/v1/confirm-notification';
    const headers = { "api-key": api_key };
    const params = { transfer_id, result, beneficiary_signature };
    return await request.postSygnaBridge(url, headers, params);
}

module.exports = {
    callBackConfirmNotification
};