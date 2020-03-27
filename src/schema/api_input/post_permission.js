const { REJECTED, RejectCode } = require('../../config');

const schema = {
  "type": "object",
  "properties": {
    "transfer_id": {
      "type": "string",
      "minLength": 64,
      "maxLength": 64
    },
    "permission_status": {
      "type": "string",
      "minLength": 1,
      "enum": [
        "ACCEPTED",
        "REJECTED"
      ]
    },
    "signature": {
      "type": "string",
      "minLength": 128,
      "maxLength": 128,
      "pattern": "^[0123456789A-Fa-f]+$"
    },
    "expire_date": {
      "type": "number",
      "minimum": 0
    },
    "reject_code": {
      "type": "string",
      "minLength": 1,
      "enum": [
        "BVRC001",
        "BVRC002",
        "BVRC003",
        "BVRC004",
        "BVRC999"
      ]
    },
    "reject_message": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": [
    "transfer_id",
    "permission_status",
    "signature"
  ],
  "additionalProperties": false
}

exports.post_permission_schema = schema;
exports.genPostPermissionSchema = (paramObj) => {
  // if (!paramObj || paramObj.permission_status !== REJECTED) {
  //   return schema;
  // }
  // const clonedObjArray = [...schema.required];
  // clonedObjArray.push('reject_code');
  // if(paramObj.reject_code === RejectCode.BVRC999){
  //   clonedObjArray.push('reject_message');
  // }
  // return {
  //   ...schema,
  //   required: clonedObjArray
  // };
  return schema;
}