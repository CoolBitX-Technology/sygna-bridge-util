const crypto = require('../crypto');
const fetch = require('node-fetch');
const check = require('./check');
const { SYGNA_BRIDGE_CENTRAL_PUBKEY } = require('../config');

class API {
    constructor(username, password, sygnaBridgeDomain){
        this.username = username;
        this.password = password;
        this.domain = sygnaBridgeDomain;
    }

    /**
     * A Wrapper function of getVASPList to return specific VASP's publickey.
     * @param {string} vasp_code 
     * @param {boolean?} validate whether to validate returned vasp list data.
     * @return {Promise<string>} uncompressed publickey
     */
    async getVASPPublicKey(vasp_code, validate=true){
        const vasps = await this.getVASPList(validate);
        const target = vasps.filter(vasp=>vasp.vasp_code === vasp_code).map(vasp=>vasp.vasp_pubkey);
        if (target.length < 1) throw new Error("Invalid vasp_code");
        return target[0];
    }

    /**
     * get list of registered VASP associated with publicKey.
     * @param {boolean?} validate whether to validate returned vasp list data.
     * @return {Promise<Array<{ vasp_name:string, vasp_code:string, vasp_pubkey:string }>>}
     */
    async getVASPList(validate=true){
        const url = this.domain + '/v1/bridge/vasp';
        const result = await this.getSB(url);
        if (!validate) return result.vasp_data;
        
        const valid = crypto.verifyObject(result, SYGNA_BRIDGE_CENTRAL_PUBKEY);
        if (valid) return result.vasp_data;
        throw Error("get VASP info error: invalid signature.");
    }

    /**
     * Notify Sygna Bridge that you have confirmed specific permission Request from other VASP.
     * Should be called by Beneficiary Server
     * @param {string} callback_url
     * @param {{transfer_id:string, result:string, signature:string}} confirmNotificationObj
     * @param {string} result
     * @return {Promise}
     */
    async postPermission(callback_url, confirmNotificationObj){
        return await this.postSB(callback_url, confirmNotificationObj);
    }

    /**
     * get detail of particular transaction premission request 
     * @param {string} transfer_id 
     */
    async getStatus(transfer_id){
      const url = this.domain + '/v1/bridge/transaction/status?transfer_id=' + transfer_id;
      const result = await this.getSB(url);
      return result;
    }

   /** 
    * Should be called by Originator.
    * @param {{private_info:string, transaction:{}, data_dat:string, signature:string}} requestData Private sender info encoded by crypto.sygnaEncodePrivateObj
    * @param {{callback_url: string, signature:string}} callback callback Obj 
    * @return {Promise<{transfer_id: string}>} transfer-id 
    */
   async postPermissionRequest(requestData, callback) {
      check.checkObjSigned(requestData);
      check.checkObjSigned(callback);
      const url = this.domain + '/v1/bridge/transaction/permission-request';
      const params = { data: requestData, callback};
      return await this.postSB(url, params);
   }

   /**
    * Send broadcasted transaction id to Sygna Bridge for purpose of storage.
    * @param {{transfer_id: string, txid:string, signature:string}} sendTxIdObj
    * @return {Promise}
    */
    async postTransactionId(sendTxIdObj) {
      check.checkObjSigned(sendTxIdObj);
      if (typeof sendTxIdObj.transfer_id != "string") throw new Error(`Obj.transfer_id should be string, got ${typeof sendTxIdObj.transfer_id}`);
      if (typeof sendTxIdObj.txid != "string") throw new Error(`Obj.txid should be string, got ${typeof sendTxIdObj.txid}`);
        const url = this.domain + '/v1/bridge/transaction/txid';
        return await this.postSB(url, sendTxIdObj);
    }

    /**
     * HTTP Post request to Sygna Bridge
     * @param {string} url 
     * @param {object} json 
     */
    async postSB (url, json ) {
        const headers = {
            "Content-Type":"application/json",
            "Authorization": 'Basic ' + Buffer.from(this.username + ":" + this.password).toString('base64')
        };
        const response = await fetch(url, { method: 'POST', body: JSON.stringify(json), headers: headers });
        return await response.json();
    }
    
    /**
     * HTTP GET request to Sygna Bridge
     * @param {string} url 
     */
    async getSB (url ) {
        const headers = { "Authorization": 'Basic ' + Buffer.from(this.username + ":" + this.password).toString('base64')};
        const response = await fetch(url, { headers:headers });
        return await response.json();
    }
}

module.exports = {
    API
};