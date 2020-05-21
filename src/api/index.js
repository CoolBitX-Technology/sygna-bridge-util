const crypto = require('../crypto');
const fetch = require('node-fetch');
const {
  SYGNA_BRIDGE_CENTRAL_PUBKEY,
  SYGNA_BRIDGE_CENTRAL_PUBKEY_TEST,
} = require('../config');

class API {
  constructor(api_key, sygnaBridgeDomain) {
    this.api_key = api_key;
    this.domain = sygnaBridgeDomain;
  }

  /**
   * A Wrapper function of getVASPList to return specific VASP's publickey.
   * @param {string} vasp_code
   * @param {boolean?} validate whether to validate returned vasp list data.
   * @param {boolean?} isProd whether to use production public key
   * @return {Promise<string>} uncompressed publickey
   */
  async getVASPPublicKey(vasp_code, validate = true, isProd = false) {
    const vasps = await this.getVASPList(validate, isProd);
    const targetVasp = vasps.find((vasp) => {
      return vasp.vasp_code === vasp_code;
    });
    if (!targetVasp) throw new Error('Invalid vasp_code');
    return targetVasp.vasp_pubkey;
  }

  /**
   * get list of registered VASP associated with publicKey.
   * @param {boolean?} validate whether to validate returned vasp list data.
   * @param {boolean?} isProd whether to use production public key
   * @return {Promise<Array<{ vasp_name:string, vasp_code:string, vasp_pubkey:string }>>}
   */
  async getVASPList(validate = true, isProd = false) {
    const url = this.domain + 'api/v2/bridge/vasp';
    const result = await this.getSB(url);
    if (!result.vasp_data) {
      throw new Error(`Request VASPs failed: ${result.message}`);
    }
    if (!validate) return result.vasp_data;

    const valid = crypto.verifyObject(
      result,
      isProd ? SYGNA_BRIDGE_CENTRAL_PUBKEY : SYGNA_BRIDGE_CENTRAL_PUBKEY_TEST,
    );
    if (valid) return result.vasp_data;
    throw Error('get VASP info error: invalid signature.');
  }

  /**
   * Notify Sygna Bridge that you have confirmed specific permission Request from other VASP.
   * Should be called by Beneficiary Server
   * @param {{transfer_id:string, permission_status:string, expire_date?:number, reject_code?:string, reject_message?:string, signature:string}} data
   * @return {Promise}
   */
  async postPermission(data) {
    const url = this.domain + 'api/v2/bridge/transaction/permission';
    return await this.postSB(url, data);
  }

  /**
   * get detail of particular transaction premission request
   * @param {string} transfer_id
   */
  async getStatus(transfer_id) {
    const url =
      this.domain +
      'api/v2/bridge/transaction/status?transfer_id=' +
      transfer_id;
    const result = await this.getSB(url);
    return result;
  }

  /**
   * Should be called by Originator.
   * @param {{ data : {private_info:string, transaction:{}, data_dat:string, expire_date?:number, signature:string}, callback : {callback_url: string, signature:string} }} data
   * data : Private sender info encoded by crypto.sygnaEncodePrivateObj
   * @return {Promise<{transfer_id: string}>} transfer-id
   */
  async postPermissionRequest(data) {
    const url = this.domain + 'api/v2/bridge/transaction/permission-request';
    return await this.postSB(url, data);
  }

  /**
   * Send broadcasted transaction id to Sygna Bridge for purpose of storage.
   * @param {{transfer_id: string, txid:string, signature:string}} data
   * @return {Promise}
   */
  async postTransactionId(data) {
    const url = this.domain + 'api/v2/bridge/transaction/txid';
    return await this.postSB(url, data);
  }

  /**
   * HTTP Post request to Sygna Bridge
   * @param {string} url
   * @param {object} json
   */
  async postSB(url, json) {
    const headers = {
      'Content-Type': 'application/json',
      api_key: this.api_key,
    };
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(json),
      headers: headers,
    });
    return await response.json();
  }

  /**
   * HTTP GET request to Sygna Bridge
   * @param {string} url
   */
  async getSB(url) {
    const headers = { api_key: this.api_key };
    const response = await fetch(url, { headers: headers });
    return await response.json();
  }

  /**
   * This allows VASP to update the Beneficiary's callback URL programmatically.
   * @param {{vasp_code: string,callback_permission_request_url?:string,callback_txid_url?:string, signature:string}} data
   * @return {Promise}
   */
  async postBeneficiaryEndpointUrl(data) {
    const url = this.domain + 'api/v2/bridge/vasp/beneficiary-endpoint-url';
    return await this.postSB(url, data);
  }
}

module.exports = {
  API,
};
