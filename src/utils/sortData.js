const {
  ACCEPTED,
  REJECTED
} = require('../config/permissionStatus')
/**
 * Sort callback data for signCallback.
 * @param {{callback_url:string}} data
 * @return  {{callback_url:string}} sorted data
 */
exports.sortCallbackData = (data) => {
  return {
    callback_url: data.callback_url
  }
}

/**
 * Sort txId data for signTxId.
 * @param {{transfer_id:string,txid:string}} data
 * @return  {{transfer_id:string,txid:string}} sorted data
 */
exports.sortTxIdData = (data) => {
  return {
    transfer_id: data.transfer_id,
    txid: data.txid,
  }
}

/**
 * Sort permission data for signPermission.
 * @param {{transfer_id:string, permission_status:REJECTED | ACCEPTED, expire_date?:number, reject_code?:string, reject_message?:string}} data
 * @return {{transfer_id:string, permission_status:REJECTED | ACCEPTED, expire_date?:number, reject_code?:string, reject_message?:string}} sorted data
 */
exports.sortPermissionData = (data) => {
  const sortedData = {
    transfer_id: data.transfer_id,
    permission_status: data.permission_status

  };
  if (data.expire_date) {
    sortedData.expire_date = data.expire_date;
  }
  if (data.permission_status === REJECTED) {
    if (data.reject_code) {
      sortedData.reject_code = data.reject_code;
    }
    if (data.reject_message) {
      sortedData.reject_message = data.reject_message;
    }
  }

  return sortedData;
}

/**
 * Sort permissionRequest data for signPermissionRequest.
 * @param {{private_info: string, transaction:object, data_dt:string, expire_date?:number}} data
 * @return {{private_info: string, transaction:object, data_dt:string, expire_date?:number}} sorted data
 */
exports.sortPermissionRequestData = (data) => {
  const sortedData = {
    private_info: data.private_info
  };
  const { transaction } = data;
  const sortedTransaction = {
    originator_vasp_code: transaction.originator_vasp_code,
    originator_addrs: transaction.originator_addrs
  }
  if (transaction.originator_addrs_extra) {
    sortedTransaction.originator_addrs_extra = transaction.originator_addrs_extra;
  }

  sortedTransaction.beneficiary_vasp_code = transaction.beneficiary_vasp_code;
  sortedTransaction.beneficiary_addrs = transaction.beneficiary_addrs;
  if (transaction.beneficiary_addrs_extra) {
    sortedTransaction.beneficiary_addrs_extra = transaction.beneficiary_addrs_extra;
  }

  sortedTransaction.transaction_currency = transaction.transaction_currency;
  sortedTransaction.amount = transaction.amount;

  sortedData.transaction = sortedTransaction;
  sortedData.data_dt = data.data_dt;

  if (data.expire_date) {
    sortedData.expire_date = data.expire_date;
  }
  return sortedData;
}

/**
 * Sort postPermission data for postPermission.
 * @param {{transfer_id:string, permission_status:string, expire_date?:number, reject_code?:string, reject_message?:string, signature:string}} data
 * @return {{transfer_id:string, permission_status:string, expire_date?:number, reject_code?:string, reject_message?:string, signature:string}} sorted data
 */
exports.sortPostPermissionData = (data) => {
  const sortedData = this.sortPermissionData(data);
  sortedData.signature = data.signature;
  return sortedData;
}

/**
 * Sort postPermissionRequest data for postPermissionRequest.
 * @param {{ data : {private_info:string, transaction:{}, data_dat:string, expire_date?:number, signature:string}, callback : {callback_url: string, signature:string} }} data
 * @return {{ data : {private_info:string, transaction:{}, data_dat:string, expire_date?:number, signature:string}, callback : {callback_url: string, signature:string} }} sorted data
 */
exports.sortPostPermissionRequestData = (data) => {
  const sortedPermissionRequestData = this.sortPermissionRequestData(data.data);
  sortedPermissionRequestData.signature = data.data.signature;
  const sortedCallbackData = this.sortCallbackData(data.callback);
  sortedCallbackData.signature = data.callback.signature;
  const sortedData = {
    data: sortedPermissionRequestData,
    callback: sortedCallbackData
  }
  return sortedData;
}

/**
 * Sort postTransactionId data for postTransactionId.
 * @param  {{transfer_id: string, txid:string, signature:string}} data
 * @return  {{transfer_id: string, txid:string, signature:string}} sorted data
 */
exports.sortPostTransactionIdData = (data) => {
  const sortedTxIdData = this.sortTxIdData(data);
  sortedTxIdData.signature = data.signature;
  return sortedTxIdData;
}