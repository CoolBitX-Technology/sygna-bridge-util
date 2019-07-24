const originator = require('./originator');
const beneficiary = require('./beneficiary');

/**
 * Request specific vasp's public key. Can be called by anyone.
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

module.exports = {
    getVASPPublicKey,
    originator,
    beneficiary,
};