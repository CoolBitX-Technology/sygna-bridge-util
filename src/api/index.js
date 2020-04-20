const crypto = require('../crypto');
const fetch = require('node-fetch');
const {
  SYGNA_BRIDGE_CENTRAL_PUBKEY,
  SYGNA_BRIDGE_CENTRAL_PUBKEY_TEST,
} = require('../config');
const {
  validateGetTransferStatusSchema,
  validatePostPermissionSchema,
  validatePostPermissionRequestSchema,
  validatePostTxIdSchema,
  sortPostPermissionData,
  sortPostPermissionRequestData,
  sortPostTransactionIdData,
  validatePostBeneficiaryEndpointUrlSchema,
  sortPostBeneficiaryEndpointUrlData,
} = require('../utils');

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
    const url = this.domain + 'api/v1.1.0/bridge/vasp';
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
    const valid = validatePostPermissionSchema(data);
    if (!valid[0]) {
      throw valid[1];
    }
    const url = this.domain + 'api/v1.1.0/bridge/transaction/permission';
    const sortedData = sortPostPermissionData(data);
    return await this.postSB(url, sortedData);
  }

  /**
   * get detail of particular transaction premission request
   * @param {string} transfer_id
   */
  async getStatus(transfer_id) {
    const valid = validateGetTransferStatusSchema({ transfer_id });
    if (!valid[0]) {
      throw valid[1];
    }
    const url =
      this.domain +
      'api/v1.1.0/bridge/transaction/status?transfer_id=' +
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
    const valid = validatePostPermissionRequestSchema(data);
    if (!valid[0]) {
      throw valid[1];
    }
    const url =
      this.domain + 'api/v1.1.0/bridge/transaction/permission-request';
    const sortedData = sortPostPermissionRequestData(data);
    return await this.postSB(url, sortedData);
  }

  /**
   * Send broadcasted transaction id to Sygna Bridge for purpose of storage.
   * @param {{transfer_id: string, txid:string, signature:string}} data
   * @return {Promise}
   */
  async postTransactionId(data) {
    const valid = validatePostTxIdSchema(data);
    if (!valid[0]) {
      throw valid[1];
    }
    const url = this.domain + 'api/v1.1.0/bridge/transaction/txid';
    const sortedData = sortPostTransactionIdData(data);
    return await this.postSB(url, sortedData);
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
   * revise beneficiary endpoint url
   * @param {{vasp_code: string, beneficiary_endpoint_url:string, signature:string}} data
   * @return {Promise}
   */
  async postBeneficiaryEndpointUrl(data) {
    const valid = validatePostBeneficiaryEndpointUrlSchema(data);
    if (!valid[0]) {
      throw valid[1];
    }
    const url = this.domain + 'api/v1.1.0/bridge/vasp/beneficiary-endpoint-url';
    const sortedData = sortPostBeneficiaryEndpointUrlData(data);
    return await this.postSB(url, sortedData);
  }
}

module.exports = {
  API,
};
