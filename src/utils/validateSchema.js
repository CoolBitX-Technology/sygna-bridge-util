const Ajv = require('ajv');
const permission_schema = require('../schema/data/permission.json');
const permission_request_schema = require('../schema/data/permission_request.json');
const callback_schema = require('../schema/data/callback.json');

const post_permission_schema = require('../schema/api_input/post_permission.json');
const post_permission_request_schema = require('../schema/api_input/post_permission_request.json');
const post_retry_schema = require('../schema/api_input/post_retry.json');
const post_txid_schema = require('../schema/api_input/post_txid.json');
const get_transfer_status_schema = require('../schema/api_input/get_transfer_status.json');

const res_get_transfer_status_schema = require('../schema/api_response/res_get_transfer_status.json');
const res_get_vasp_schema = require('../schema/api_response/res_get_vasp.json');
const res_ok_schema = require('../schema/api_response/res_ok.json');
const res_post_permission_request_schema = require('../schema/api_response/res_post_permission_request.json');
const res_retry_schema = require('../schema/api_response/res_retry.json');

exports.validateSchema = (paramObj, schema) => {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, paramObj);
  if (!valid) {
    return [false, ajv.errors];
  } else {
    return [true];
  }
}

exports.validateCallbackSchema = (paramObj) => {
  return this.validateSchema(paramObj, callback_schema);
}

exports.validatePermissionSchema = (paramObj) => {
  return this.validateSchema(paramObj, permission_schema);
}

exports.validatePermissionRequestSchema = (paramObj) => {
  return this.validateSchema(paramObj, permission_request_schema);
}

exports.validatePostPermissionSchema = (paramObj) => {
  return this.validateSchema(paramObj, post_permission_schema);
}

exports.validatePostPermissionRequestSchema = (paramObj) => {
  return this.validateSchema(paramObj, post_permission_request_schema);
}

exports.validatePostRetrySchema = (paramObj) => {
  return this.validateSchema(paramObj, post_retry_schema);
}

exports.validatePostTxIdSchema = (paramObj) => {
  return this.validateSchema(paramObj, post_txid_schema);
}

exports.validateGetTransferStatusSchema = (paramObj) => {
  return this.validateSchema(paramObj, get_transfer_status_schema);
}


exports.validateResGetTransferStatusSchema = (paramObj) => {
  return this.validateSchema(paramObj, res_get_transfer_status_schema);
}

exports.validateResGetVaspSchema = (paramObj) => {
  return this.validateSchema(paramObj, res_get_vasp_schema);
}

exports.validateResOkSchema = (paramObj) => {
  return this.validateSchema(paramObj, res_ok_schema);
}

exports.validateResPostPermissionRequestSchema = (paramObj) => {
  return this.validateSchema(paramObj, res_post_permission_request_schema);
}

exports.validateResRetrySchema = (paramObj) => {
  return this.validateSchema(paramObj, res_retry_schema);
}