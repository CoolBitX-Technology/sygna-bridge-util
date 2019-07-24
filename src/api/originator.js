const request = require('./request');

/**
 * Ask Sygna Bridge To relay transfer reqiest to beneficiary.
 * Should be called by Originator.
 * @param {string} sygnaBridgeDomain 
 * @param {string} api_key
 * @param {string} hex_data Private sender info encoded by crypto.sygnaEncodePrivateObj
 * @param {{originator_vasp_code: string, originator_addr:string, beneficiary_vasp_code:string, beneficiary_addr:string, transaction_currency:string, amount:number}} transaction
 * @param {string} originator_signature Signature of {hex_data, transaction} signed with crypto.signObject
 * @param {string} callback_url The url 
 * @return {Promise<string>} transfer-id 
 */
async function transfer(sygnaBridgeDomain, api_key, hex_data, transaction, originator_signature, callback_url) {
    const url = sygnaBridgeDomain + '/v1/transfer';
    const headers = { "api-key": api_key };
    const params = { hex_data, transaction, originator_signature, callback_url };
    const transfer_id = await request.postSygnaBridge(url, headers, params);
    return transfer_id;
}

/**
 * Send broadcasted transaction id to Sygna Bridge for purpose of storage.
 * @param {string} sygnaBridgeDomain 
 * @param {string} api_key 
 * @param {string} txid 
 * @param {string} transfer_id the id got from transfer request
 * @param {string} originator_signature Signature of {txid, transfer_id} signed with crypto.signObject
 * @return {Promise}
 */
async function sendTransactionId(sygnaBridgeDomain, api_key, txid, transfer_id, originator_signature) {
    const url = sygnaBridgeDomain + '/v1/send-txid';
    const headers = { "api-key": api_key };
    const params = { txid, transfer_id, originator_signature };
    return await request.postSygnaBridge(url, headers, params);
}

module.exports = {
    transfer,
    sendTransactionId
};