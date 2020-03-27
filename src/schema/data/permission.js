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
    "permission_status"
  ],
  "additionalProperties": false
}
exports.permission_schema = schema;

exports.genPermissionSchema = (paramObj) => {
  // if (!paramObj || paramObj.permission_status !== REJECTED) {
  //   return schema;
  // }
  // const clonedObjArray = [...schema.required];
  // clonedObjArray.push('reject_code');
  // if (paramObj.reject_code === RejectCode.BVRC999) {
  //   clonedObjArray.push('reject_message');
  // }
  // return {
  //   ...schema,
  //   required: clonedObjArray
  // };
  return schema;
}