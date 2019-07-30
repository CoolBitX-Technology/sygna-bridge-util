const request = require('./request');



/**
 * Send broadcasted transaction id to Sygna Bridge for purpose of storage.
 * @param {string} sygnaBridgeDomain 
 * @param {string} api_key 
 * @param {string} transfer_id the id got from transfer request
 * @param {string} txid tx id on blockchain
 * @param {string} originator_signature Signature of { transfer_id, txid } signed with crypto.signObject
 * @return {Promise}
 */
async function sendTransactionId(sygnaBridgeDomain, api_key, transfer_id, txid, originator_signature) {
    const url = sygnaBridgeDomain + '/v1/send-txid';
    const headers = { "api-key": api_key };
    const params = { transfer_id, txid, originator_signature };
    return await request.postSygnaBridge(url, headers, params);
}

module.exports = {
    transfer,
    sendTransactionId
};