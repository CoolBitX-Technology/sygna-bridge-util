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
    
}

module.exports = {
    callBackConfirmNotification
};