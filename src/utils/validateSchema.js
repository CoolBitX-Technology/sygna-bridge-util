const Ajv = require('ajv');
const { validateExpireDate } = require('./validateExpireDate');
const { genPermissionSchema } = require('../schema/data/permission');
const permission_request_schema = require('../schema/data/permission_request.json');
const callback_schema = require('../schema/data/callback.json');
const txid_schema = require('../schema/data/txid.json');

const {
  genPostPermissionSchema,
} = require('../schema/api_input/post_permission');
const post_permission_request_schema = require('../schema/api_input/post_permission_request.json');
const post_retry_schema = require('../schema/api_input/post_retry.json');
const post_txid_schema = require('../schema/api_input/post_txid.json');
const get_transfer_status_schema = require('../schema/api_input/get_transfer_status.json');

const res_get_transfer_status_schema = require('../schema/api_response/res_get_transfer_status.json');
const res_get_vasp_schema = require('../schema/api_response/res_get_vasp.json');
const res_ok_schema = require('../schema/api_response/res_ok.json');
const res_post_permission_request_schema = require('../schema/api_response/res_post_permission_request.json');
const res_retry_schema = require('../schema/api_response/res_retry.json');

const beneficiary_endpoint_url_schema = require('../schema/data/beneficiary_endpoint_url.json');
const post_beneficiary_endpoint_url_schema = require('../schema/api_input/post_beneficiary_endpoint_url.json');

const get_currencies_querystring_schema = require('../schema/api_input/get_currencies_querystring.json');
const res_get_currencies_schema = require('../schema/api_response/res_get_currencies_schema.json');

exports.validateSchema = (paramObj, schema) => {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, paramObj);
  if (!valid) {
    return [false, ajv.errors];
  } else {
    return [true];
  }
};

exports.validateCallbackSchema = (paramObj) => {
  return this.validateSchema(paramObj, callback_schema);
};

exports.validateTxIdSchema = (paramObj) => {
  return this.validateSchema(paramObj, txid_schema);
};

exports.validatePermissionSchema = (paramObj) => {
  const valid = this.validateSchema(paramObj, genPermissionSchema(paramObj));
  if (!valid[0]) {
    return valid;
  }
  return validateExpireDate(paramObj.expire_date);
};

exports.validatePermissionRequestSchema = (paramObj) => {
  const valid = this.validateSchema(paramObj, permission_request_schema);
  if (!valid[0]) {
    return valid;
  }
  return validateExpireDate(paramObj.expire_date);
};

exports.validatePostPermissionSchema = (paramObj) => {
  const valid = this.validateSchema(
    paramObj,
    genPostPermissionSchema(paramObj),
  );
  if (!valid[0]) {
    return valid;
  }
  return validateExpireDate(paramObj.expire_date);
};

exports.validatePostPermissionRequestSchema = (paramObj) => {
  const valid = this.validateSchema(paramObj, post_permission_request_schema);
  if (!valid[0]) {
    return valid;
  }
  return validateExpireDate(paramObj.data.expire_date);
};

exports.validatePostRetrySchema = (paramObj) => {
  return this.validateSchema(paramObj, post_retry_schema);
};

exports.validatePostTxIdSchema = (paramObj) => {
  return this.validateSchema(paramObj, post_txid_schema);
};

exports.validateGetTransferStatusSchema = (paramObj) => {
  return this.validateSchema(paramObj, get_transfer_status_schema);
};

exports.validateResGetTransferStatusSchema = (paramObj) => {
  return this.validateSchema(paramObj, res_get_transfer_status_schema);
};

exports.validateResGetVaspSchema = (paramObj) => {
  return this.validateSchema(paramObj, res_get_vasp_schema);
};

exports.validateResOkSchema = (paramObj) => {
  return this.validateSchema(paramObj, res_ok_schema);
};

exports.validateResPostPermissionRequestSchema = (paramObj) => {
  return this.validateSchema(paramObj, res_post_permission_request_schema);
};

exports.validateResRetrySchema = (paramObj) => {
  return this.validateSchema(paramObj, res_retry_schema);
};

exports.validateBeneficiaryEndpointUrlSchema = (paramObj) => {
  return this.validateSchema(paramObj, beneficiary_endpoint_url_schema);
};

exports.validatePostBeneficiaryEndpointUrlSchema = (paramObj) => {
  return this.validateSchema(paramObj, post_beneficiary_endpoint_url_schema);
};

exports.validateGetCurrenciesQueryString = (paramObj) => {
  return this.validateSchema(paramObj, get_currencies_querystring_schema);
};

exports.validateResGetCurrenciesSchema = (paramObj) => {
  return this.validateSchema(paramObj, res_get_currencies_schema);
};
