const request = require('./request');

/**
 * Request specific vasp's public key.
 * @param {string} vasp_code 
 * @return {Promise<string>} uncompressed publickey
 */
async function getVASPPublicKey(sygnaBridgeDomain, api_key, vasp_code){
    const url = sygnaBridgeDomain + '/v1/get-vasp';
    const headers = { "api-key": api_key };
    const vasps = await request.getSygnaBridge(url, headers);
    const target = vasps.filter(vasp=>vasp.vasp_code === vasp_code).map(vasp=>vasp.vasp_pubkey);
    if (target.length < 1) throw new Error("Invalid vasp_code");
    return target[0];
}


/**
 * Notify Sygna Bridge that you have confirmed specific transfer from other VASP.
 * @param {string} callback_url 
 * @param {{transfer_id:string, beneficiary_signature:string, result:string}} params 
 * @return {Promise<boolean>}
 */
async function callBackConfirmNotification(callback_url, api_key, params) {
    let url = callback_url + '/v1/confirm-notification';
    let headers = { "api-key": api_key };
    let { transfer_id } = params;
    return true;
}

module.exports = {
    getVASPPublicKey,
    callBackConfirmNotification
};