const originator = require('./originator');
const beneficiary = require('./beneficiary');

// const crypto = require('../crypto');
// const { SYGNA_BRIDGE_CENTRAL_PUBKEY } = require('../config');

/**
 * get list of registered VASP associated with publicKey.
 * @param {string} sygnaBridgeDomain 
 * @param {string} api_key 
 * @return {Promise<Array<{ vasp_name:string, vasp_code:string, vasp_pubkey:string }>>}
 */
async function getVASPList(sygnaBridgeDomain, api_key){
    const url = sygnaBridgeDomain + '/v1/get-vasp';
    const headers = { "api-key": api_key };
    // const { vasps, signature } = await request.getSygnaBridge(url, headers);
    // const valid = crypto.verifyObject(vasps, SYGNA_BRIDGE_CENTRAL_PUBKEY, signature);
    const vasps = await request.getSygnaBridge(url, headers);
    return vasps;
}

/**
 * A Wrapper function of getVASPList to return specific VASP's publickey.
 * @param {string} sygnaBridgeDomain
 * @param {string} api_key
 * @param {string} vasp_code 
 * @return {Promise<string>} uncompressed publickey
 */
async function getVASPPublicKey(sygnaBridgeDomain, api_key, vasp_code){
    const vasps = await getVASPList(sygnaBridgeDomain, api_key);
    const target = vasps.filter(vasp=>vasp.vasp_code === vasp_code).map(vasp=>vasp.vasp_pubkey);
    if (target.length < 1) throw new Error("Invalid vasp_code");
    return target[0];
}

module.exports = {
    getVASPList,
    getVASPPublicKey,
    originator,
    beneficiary,
};