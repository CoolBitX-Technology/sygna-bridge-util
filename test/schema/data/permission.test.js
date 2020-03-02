const { ACCEPTED, REJECTED, RejectCode } = require('../../../src/config');
const { validatePermissionSchema } = require('../../../src/utils/validateSchema');
const { permission_schema, genPermissionSchema } = require('../../../src/schema/data/permission');

describe('test validate permission_schema', () => {
  const transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
  const permission_status = ACCEPTED;
  const expire_date = 2529024749000;

  it('should generate correct schema', () => {
    expect(permission_schema).toEqual(genPermissionSchema());
    expect(permission_schema).toEqual(genPermissionSchema({}));
    expect(permission_schema).toEqual(genPermissionSchema({ permission_status }));

    expect({
      ...permission_schema,
      "required": [
        "transfer_id",
        "permission_status",
        "reject_code"
      ]
    }).toEqual(genPermissionSchema({ permission_status: REJECTED }));

    expect({
      ...permission_schema,
      "required": [
        "transfer_id",
        "permission_status",
        "reject_code",
        "reject_message"
      ]
    }).toEqual(genPermissionSchema({ permission_status: REJECTED, reject_code: RejectCode.BVRC999 }));

  });

  it('should validate failed if transfer_id is not valid', () => {
    const data = {};
    const valid = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'transfer_id\'');

    data.transfer_id = '';
    const valid1 = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transfer_id');
    expect(message1).toEqual('should NOT be shorter than 64 characters');

    data.transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid2 = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transfer_id');
    expect(message2).toEqual('should NOT be longer than 64 characters');
  });

  it('validate failedif permission_status is not valid', () => {
    const data = { transfer_id };
    const valid = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'permission_status\'');

    data.permission_status = 123;
    const valid1 = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.permission_status');
    expect(message1).toEqual('should be string');

    data.permission_status = '';
    const valid2 = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.permission_status');
    expect(message2).toEqual('should NOT be shorter than 1 characters');

    data.permission_status = '123';
    const valid3 = validatePermissionSchema(data, genPermissionSchema(data));
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
      expire_date: "123"
    };
    const valid = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.expire_date');
    expect(message).toEqual('should be number');

    data.expire_date = -1;
    const valid2 = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.expire_date');
    expect(message2).toEqual('should be >= 0');

  });

  it('should validate failed if reject_code is not valid', () => {
    const data = {
      transfer_id,
      permission_status,
      expire_date,
      reject_code: 123
    };
    const valid = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.reject_code');
    expect(message).toEqual('should be string');

    data.reject_code = '';
    const valid1 = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.reject_code');
    expect(message1).toEqual('should NOT be shorter than 1 characters');

    const reject_codes = Object.keys(RejectCode).map(function (key) {
      return RejectCode[key]
    });
    data.reject_code = '123';
    const valid2 = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, params, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.reject_code');
    expect(params.allowedValues).toEqual(reject_codes);
    expect(message2).toEqual('should be equal to one of the allowed values');
  });

  it('should validate failed if reject_message is not valid', () => {
    const data = {
      transfer_id,
      permission_status,
      expire_date,
      reject_code: RejectCode.BVRC001,
      reject_message: 123
    };
    const valid = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.reject_message');
    expect(message).toEqual('should be string');

    data.reject_message = '';
    const valid1 = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.reject_message');
    expect(message1).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if permission_status is REJECTED but missing reject_code', () => {
    const data = {
      transfer_id,
      permission_status: REJECTED,
      expire_date
    };
    const valid = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'reject_code\'');
  });

  it('should validate failed if permission status is REJECTED and reject_code is BVRC999 but missing reject_message', () => {
    const data = {
      transfer_id,
      permission_status: REJECTED,
      expire_date,
      reject_code: RejectCode.BVRC999
    };
    const valid = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'reject_message\'');
  });

  it('should validate success', () => {
    const data = {
      transfer_id,
      permission_status,
    };
    const valid = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid[0]).toBe(true);

    data.permission_status = REJECTED;
    data.reject_code = RejectCode.BVRC001;
    const valid1 = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid1[0]).toBe(true);

    data.reject_code = RejectCode.BVRC999;
    data.reject_message = '123'
    const valid2 = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid2[0]).toBe(true);

    data.expire_date = expire_date;
    const valid3 = validatePermissionSchema(data, genPermissionSchema(data));
    expect(valid3[0]).toBe(true);
  });
});