const crypto = require('../crypto');
const fetch = require('node-fetch');
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
        const url = this.domain + '/v1/get-vasp';
        const { vasp_data, signature } = await this.getSB(url);
        if (!validate) return vasp_data;
        
        const valid = crypto.verifyObject({vasp_data}, SYGNA_BRIDGE_CENTRAL_PUBKEY, signature);
        if (valid) return vasp_data;
        throw Error("get VASP info error: invalid signature.");
    }

    /**
     * Notify Sygna Bridge that you have confirmed specific transfer from other VASP.
     * Should be called by Beneficiary Server
     * @param {string} transfer_id
     * @param {string} beneficiary_signature
     * @param {string} result
     * @return {Promise}
     */
    async callBackConfirmNotification(transfer_id, result, beneficiary_signature){
        const url = this.domain + '/v1/confirm-notification';
        const params = { transfer_id, result, beneficiary_signature };
        return await this.postSB(url, params);
    }

   /** 
    * Should be called by Originator.
    * @param {string} hex_data Private sender info encoded by crypto.sygnaEncodePrivateObj
    * @param {{originator_vasp_code: string, originator_addr:string, beneficiary_vasp_code:string, beneficiary_addr:string, transaction_currency:string, amount:number}} transaction
    * @param {string} data_dt
    * @param {string} originator_signature Signature of {hex_data, transaction} signed with crypto.signObject
    * @param {string} callback_url The url 
    * @return {Promise<{transfer_id: string}>} transfer-id 
    */
   async transfer(hex_data, transaction, data_dt, originator_signature, callback_url) {
       const url = this.domain + '/v1/transfer';
       const params = { hex_data, transaction, data_dt, originator_signature, callback_url };
       return await this.postSB(url, params);
   }

   /**
    * Send broadcasted transaction id to Sygna Bridge for purpose of storage.
    * @param {string} transfer_id the id got from transfer request
    * @param {string} txid tx id on blockchain
    * @param {string} originator_signature Signature of { transfer_id, txid } signed with crypto.signObject
    * @return {Promise}
    */
    async sendTransactionId(transfer_id, txid, originator_signature) {
        const url = this.domain + '/v1/send-txid';
        const params = { transfer_id, txid, originator_signature };
        return await this.postSB(url, params);
    }

    async postSB (url, json ) {
        const headers = {
            "Content-Type":"application/json",
            "Authorization": 'Basic ' + Buffer.from(this.username + ":" + this.password).toString('base64')
        };
        const response = await fetch(url, { method: 'POST', body: JSON.stringify(json), headers: headers });
        return await response.json();
    }
    
    async getSB (url ) {
        const headers = { "Authorization": 'Basic ' + Buffer.from(this.username + ":" + this.password).toString('base64')};
        const response = await fetch(url, { headers:headers });
        return await response.json();
    }
}

module.exports = {
    API
};