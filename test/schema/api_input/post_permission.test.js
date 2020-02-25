const { ACCEPTED, REJECTED, RejectCode, RejectMessage } = require('../../../src/config');
const { validatePostPermissionSchema } = require('../../../src/utils/validateSchema');
const post_permission_schema = require('../../../src/schema/api_input/post_permission.json');

describe('test validate post_permission_schema', () => {
  const transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
  const permission_status = ACCEPTED;
  const expire_date = 2529024749000;
  const signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

  it('should validate failed if transfer_id is not valid', () => {
    const data = {};
    const valid = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'transfer_id\'');

    data.transfer_id = '';
    const valid1 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transfer_id');
    expect(message1).toEqual('should NOT be shorter than 64 characters');

    data.transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid2 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transfer_id');
    expect(message2).toEqual('should NOT be longer than 64 characters');

  });

  it('should validate failed if signature is not valid', () => {
    const data = {
      transfer_id,
      permission_status,
      expire_date
    };
    const valid = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'signature\'');

    data.signature = 0;
    const valid2 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.signature');
    expect(message2).toEqual('should be string');

    data.signature = '';
    const valid3 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.signature');
    expect(message3).toEqual('should NOT be shorter than 128 characters');

    data.signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid4 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.signature');
    expect(message4).toEqual('should NOT be longer than 128 characters');

    data.signature = '6b86b273ff34fce19d6b804egg5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const valid5 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid5[0]).toBe(false);
    const { dataPath: dataPath5, message: message5 } = valid5[1][0];
    expect(dataPath5).toEqual('.signature');
    expect(message5).toEqual('should match pattern \"^[0123456789A-Fa-f]+$\"');

  });

  it('validate failedif permission_status is not valid', () => {
    const data = { transfer_id };
    const valid = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'permission_status\'');

    data.permission_status = 123;
    const valid1 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.permission_status');
    expect(message1).toEqual('should be string');

    data.permission_status = '';
    const valid2 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.permission_status');
    expect(message2).toEqual('should NOT be shorter than 1 characters');

    data.permission_status = '123';
    const valid3 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, params, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.permission_status');
    expect(params.allowedValues).toEqual([ACCEPTED, REJECTED]);
    expect(message3).toEqual('should be equal to one of the allowed values');
  });

  it('should validate failed if expire_date is not valid', () => {
    const data = {
      transfer_id,
      permission_status,
      signature,
      expire_date: "123"
    };
    const valid = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.expire_date');
    expect(message).toEqual('should be number');

    data.expire_date = -1;
    const valid2 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.expire_date');
    expect(message2).toEqual('should be >= 0');
  });

  it('validate failedif reject_code is not valid', () => {
    const data = {
      transfer_id,
      permission_status,
      signature,
      expire_date,
      reject_code: 123
    };
    const valid = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.reject_code');
    expect(message).toEqual('should be string');

    data.reject_code = '';
    const valid1 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.reject_code');
    expect(message1).toEqual('should NOT be shorter than 1 characters');

    const reject_codes = Object.keys(RejectCode).map(function (key) {
      return RejectCode[key]
    });
    data.reject_code = '123';
    const valid2 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, params, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.reject_code');
    expect(params.allowedValues).toEqual(reject_codes);
    expect(message2).toEqual('should be equal to one of the allowed values');
  });

  it('validate failedif reject_message is not valid', () => {
    const data = {
      transfer_id,
      permission_status,
      signature,
      expire_date,
      reject_code: RejectCode.BVRC001,
      reject_message: 123
    };
    const valid = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.reject_message');
    expect(message).toEqual('should be string');

    data.reject_message = '';
    const valid1 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.reject_message');
    expect(message1).toEqual('should NOT be shorter than 1 characters');

    const reject_messagess = Object.keys(RejectMessage).map(function (key) {
      return RejectMessage[key]
    });
    data.reject_message = '123';
    const valid2 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, params, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.reject_message');
    expect(params.allowedValues).toEqual(reject_messagess);
    expect(message2).toEqual('should be equal to one of the allowed values');
  });

  it('should validate success', () => {
    const data = {
      transfer_id,
      permission_status,
      signature
    };
    const valid = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid[0]).toBe(true);

    data.permission_status = REJECTED;
    data.reject_code = RejectCode.BVRC001;
    data.reject_message = RejectMessage.BVRC001;
    const valid1 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid1[0]).toBe(true);

    data.expire_date = expire_date;
    const valid2 = validatePostPermissionSchema(data, post_permission_schema);
    expect(valid2[0]).toBe(true);
  });

});