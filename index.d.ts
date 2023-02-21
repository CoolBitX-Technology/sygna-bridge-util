// Type definitions for npm package @sygna/bridge-util 2.0.0
// Project: https://github.com/CoolBitX-Technology/sygna-bridge-util
// Author: Marco Tessarin (Bitbank inc.)
// TypeScript Version: 3.0

/**
 * Regulatory statuses for API.getVaspList()
 * they provide information about vasp regulation
 */
export type RegulatoryStatuses = 'Not Regulated Yet' | 'Exempt' | 'Regulated';

/**
 * Address Interface
 * provides information about the customer address and the extra info related
 */
export interface Address {
  address: string;
  addr_extra_info?: string[] | null;
}

/**
 * Transaction Interface
 * provides information about transactions
 */
export interface Transaction {
  originator_vasp: {
    vasp_code: string;
    addrs: Address[];
  };
  beneficiary_vasp: {
    vasp_code: string;
    addrs: Address[];
  };
  currency_id: string;
  amount?: string;
}

/**
 * Vasp Interface
 * Virtual Asset Service Providers information
 */
export interface Vasp {
  vasp_name: string;
  vasp_code: string;
  vasp_pubkey: string;
  vasp_server_status: string;
  last_server_checked_at: string;
  regulatoryStatus: RegulatoryStatuses;
}

/**
 * Currency Interface
 * provides information about currencies
 */
export interface Currency {
  currency_id: string;
  currency_name: string;
  currency_symbol: string;
  is_active: boolean;
  addr_extra_info: string[];
  platform: {
    id: string;
    name: string;
    symbol: string;
    token_address: string;
  } | null;
}

/**
 * Defines the response from API.getCurrencies()
 */
export interface CurrenciesResponse {
  supported_coins: Currency[];
}

/**
 * Defines the response from API.getStatus()
 */
export interface TransferDataResponse {
  transferData: {
    transfer_id: string;
    transaction: Transaction;
    data_dt: string;
    permission_request_data_signature: string;
    permission_status: string | null;
    permission_signature: string | null;
    txid_signature: string | null;
    created_at: string;
    transfer_to_originator_time: string | null;
  };
  signature: string;
}

/**
 * Defines the exported client class
 */
export class API {
  constructor(api_key: string, sygnaBridgeDomain: string);

  api_key: string;
  domain: string;

  /**
   * A Wrapper function of getVASPList to return specific VASP's publickey
   * @param {string} vasp_code
   * @param {boolean?} validate whether to validate the returning vasp list data.
   * @param {boolean?} isProd whether to use production public key
   * @return {Promise<string>} uncompressed publickey
   */
  getVASPPublicKey(vasp_code: string, validate?: boolean | null, isProd?: boolean | null): Promise<string>;

  /**
   * Get the list of registered VASP associated with publicKey
   * @param {boolean?} validate whether to validate the returning vasp list data.
   * @param {boolean?} isProd whether to use production public key
   * @return {Promise<Vasp[]>>}
   */
  getVASPList(validate?: boolean | null, isProd?: boolean | null): Promise<Vasp[]>;

  /**
   * Notifies Sygna Bridge that you have confirmed specific permission Request from other VASP.
   * Should be called by Beneficiary Server
   * @param {{transfer_id:string, permission_status:string, expire_date?:number, reject_code?:string, reject_message?:string, signature:string}} data
   * @return {Promise< { status: string }}
   */
  postPermission(data: {
    transfer_id: string;
    permission_status: string;
    expire_date?: number;
    reject_code?: string;
    reject_message?: string;
    signature: string;
  }): Promise<{ status?: string | number }>;

  /**
   * Get details of a particular transaction's permission request
   * @param {string} transfer_id
   * @return {Promise<TransferDataResponse>}
   */
  getStatus(transfer_id: string): Promise<TransferDataResponse>;

  /**
   * Should be called by the Originator VASP
   * @param {{ data : {private_info:string, transaction:{}, data_dat:string, expire_date?:number, need_validate_addr?:boolean, signature:string}, callback : {callback_url: string, signature:string} }} data
   * data : Private sender info encrypted by crypto.encryptPrivateObj
   * @return {Promise<{transfer_id?: string, message?: string, error?: string}>} transfer-id
   */
  postPermissionRequest(data: {
    data: {
      private_info: string;
      transaction: Transaction;
      data_dt: string;
      expire_date?: number;
      need_validate_addr?: boolean;
      signature: string;
    };
    callback: {
      callback_url: string;
      signature: string;
    };
  }): Promise<{
    transfer_id?: string;
    err_message?: string;
    err_code?: string;
    err_code_stacks?: string;
    extra?: {
      transfer_id: string;
    };
  }>;

  /**
   * Send broadcasted transaction id to Sygna Bridge for storage purposes
   * @param {{transfer_id: string, txid:string, signature:string}} data
   * @return {Promise<{ status: string }}
   */
  postTransactionId(data: { transfer_id: string; txid: string; signature: string }): Promise<{ status: string }>;

  /**
   * Allows VASP to update the Beneficiary's callback URL programmatically
   * @param {{vasp_code: string,callback_permission_request_url?:string,callback_txid_url?:string, signature:string}} data
   * @return {Promise<{ status: string }}
   */
  postBeneficiaryEndpointUrl(data: {
    vasp_code: string;
    callback_permission_request_url?: string;
    callback_txid_url?: string;
    callback_validate_addr_url?: string;
    callback_vasp_server_health_check_url?: string;
    signature: string;
  }): Promise<{ status: string }>;

  /**
   * Retrieves the lost transfer requests
   * @param {{vasp_code: string}} data
   * @return {Promise<number>}
   */
  postRetry(data: { vasp_code: string }): Promise<{ retry_items: number }>;

  /**
   * Get supported currencies
   * @param {{currency_id?: string,currency_symbol?: string,currency_name?: string}} data
   * @return {Promise}
   */
  getCurrencies(data: { currency_id?: string; currency_symbol?: string; currency_name?: string }): Promise<CurrenciesResponse>;
}

export module crypto {
  /**
   * Encrypts the private info object to hex string
   * @param {object|string} data priv_info in object or string format.
   * @param {string} publicKey recipeint public key in hex string.
   * @return {string} ECIES encrypted privMsg.
   */
  export function encryptPrivateObj(data: object | string, publicKey: string): string;

  /**
   * Decrypts the private info from the recipient server
   * @param {string} privMsg
   * @param {string} privateKey
   * @return {object}
   */
  export function decryptPrivateObj(privMsg: string, privateKey: string): object;

  /**
   * Adds signature to the provided permission request according to the provided key
   * @param {{private_info: string, transaction:object, data_dt:string, expire_date?:number, need_validate_addr?:boolean}} data
   * @param {string} privateKey
   * @return {{private_info: string, transaction:{}, data_dt:string, expire_date?:number, need_validate_addr?:boolean, signature:string}}
   */
  export function signPermissionRequest(
    data: {
      private_info: string;
      transaction: Transaction;
      data_dt: string;
      expire_date?: number;
      need_validate_addr?: boolean;
    },
    privateKey: string,
  ): {
    private_info: string;
    transaction: Transaction;
    data_dt: string;
    expire_date?: number;
    need_validate_addr?: boolean;
    signature: string;
  };

  /**
   * Adds signature to the provided callback object
   * @param {{callback_url:string}} data
   * @param {string} privateKey
   * @return {{callback_url, signature: string}}
   */
  export function signCallBack(
    data: {
      callback_url: string;
    },
    privateKey: string,
  ): {
    callback_url: string;
    signature: string;
  };

  /**
   * @param {{transfer_id:string, permission_status:REJECTED | ACCEPTED, expire_date?:number, reject_code?:string, reject_message?:string}} data
   * @param {string} privateKey
   * @return {{transfer_id:string, permission_status:REJECTED| ACCEPTED, signature: string, expire_date?:number, reject_code?:string, reject_message?:string}}}
   */
  export function signPermission(
    data: {
      transfer_id: string;
      permission_status: string;
      expire_date?: number;
      reject_code?: string;
      reject_message?: string;
    },
    privateKey: string,
  ): {
    transfer_id: string;
    permission_status: string;
    signature: string;
    expire_date?: number;
    reject_code?: string;
    reject_message?: string;
  };

  /**
   * Adds signature to the provided transaction object
   * @param {{transfer_id:string, txid:string}} data
   * @param {string} privateKey
   * @return {{transfer_id:string, txid:string, signature:string}}
   */
  export function signTxId(
    data: {
      transfer_id: string;
      txid: string;
    },
    privateKey: string,
  ): {
    transfer_id: string;
    txid: string;
    signature: string;
  };

  /**
   * Adds signature to any provided object
   * @param {object} obj
   * @param {string} privateKey
   * @return {object} original object adding a signature field
   */
  export function signObject(obj: object, privateKey: string): object;

  /**
   * Verifies obj with provided pubkey or default sygna bridge publickey
   * @param {object} obj
   * @param {string?} publicKey default to sygna bridge's publickey
   * @return {boolean}
   */
  export function verifyObject(obj: object, publicKey?: string | null): boolean;

  /**
   * Adds signature to sign beneficiary endpoint object
   * @param {{vasp_code:string,callback_permission_request_url?:string,callback_txid_url?:string,callback_validate_addr_url?:string}} data
   * @param {string} privateKey
   * @return {{vasp_code:string,callback_permission_request_url?:string,,callback_txid_url?:string,callback_validate_addr_url?:string,signature:string}}
   */
  export function signBeneficiaryEndpointUrl(
    data: {
      vasp_code: string;
      callback_permission_request_url?: string;
      callback_txid_url?: string;
      callback_validate_addr_url?: string;
    },
    privateKey: string,
  ): {
    vasp_code: string;
    callback_permission_request_url?: string;
    callback_txid_url?: string;
    callback_validate_addr_url?: string;
    signature: string;
  };
}
