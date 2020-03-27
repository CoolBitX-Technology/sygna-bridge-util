const { ACCEPTED, REJECTED, RejectCode } = require('../../../src/config');
const { validatePostPermissionSchema } = require('../../../src/utils/validateSchema');
const { post_permission_schema, genPostPermissionSchema } = require('../../../src/schema/api_input/post_permission');

describe('test validate post_permission_schema', () => {
  const transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
  const permission_status = ACCEPTED;
  const expire_date = 2529024749000;
  const signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

  it('should generate correct schema', () => {
    expect(post_permission_schema).toEqual(genPostPermissionSchema());
    expect(post_permission_schema).toEqual(genPostPermissionSchema({}));
    expect(post_permission_schema).toEqual(genPostPermissionSchema({ permission_status }));

    // expect({
    //   ...post_permission_schema,
    //   "required": [
    //     "transfer_id",
    //     "permission_status",
    //     "signature",
    //     "reject_code"
    //   ]
    // }).toEqual(genPostPermissionSchema({ permission_status: REJECTED }));

    // expect({
    //   ...post_permission_schema,
    //   "required": [
    //     "transfer_id",
    //     "permission_status",
    //     "signature",
    //     "reject_code",
    //     "reject_message"
    //   ]
    // }).toEqual(genPostPermissionSchema({ permission_status: REJECTED, reject_code: RejectCode.BVRC999 }));
  });


  it('should validate failed if transfer_id is not valid', () => {
    const data = {};
    const valid = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'transfer_id\'');

    data.transfer_id = '';
    const valid1 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transfer_id');
    expect(message1).toEqual('should NOT be shorter than 64 characters');

    data.transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid2 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
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
    const valid = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'signature\'');

    data.signature = 0;
    const valid2 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.signature');
    expect(message2).toEqual('should be string');

    data.signature = '';
    const valid3 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.signature');
    expect(message3).toEqual('should NOT be shorter than 128 characters');

    data.signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid4 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.signature');
    expect(message4).toEqual('should NOT be longer than 128 characters');

    data.signature = '6b86b273ff34fce19d6b804egg5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const valid5 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid5[0]).toBe(false);
    const { dataPath: dataPath5, message: message5 } = valid5[1][0];
    expect(dataPath5).toEqual('.signature');
    expect(message5).toEqual('should match pattern \"^[0123456789A-Fa-f]+$\"');
  });

  it('validate failedif permission_status is not valid', () => {
    const data = { transfer_id };
    const valid = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'permission_status\'');

    data.permission_status = 123;
    const valid1 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.permission_status');
    expect(message1).toEqual('should be string');

    data.permission_status = '';
    const valid2 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.permission_status');
    expect(message2).toEqual('should NOT be shorter than 1 characters');

    data.permission_status = '123';
    const valid3 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
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
    const valid = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.expire_date');
    expect(message).toEqual('should be number');

    data.expire_date = -1;
    const valid2 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
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
    const valid = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.reject_code');
    expect(message).toEqual('should be string');

    data.reject_code = '';
    const valid1 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.reject_code');
    expect(message1).toEqual('should NOT be shorter than 1 characters');

    const reject_codes = Object.keys(RejectCode).map(function (key) {
      return RejectCode[key]
    });
    data.reject_code = '123';
    const valid2 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
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
    const valid = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.reject_message');
    expect(message).toEqual('should be string');

    data.reject_message = '';
    const valid1 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.reject_message');
    expect(message1).toEqual('should NOT be shorter than 1 characters');
  });

  // it('validate failed if permission_status is REJECTED but missing reject_code', () => {
  //   const data = {
  //     transfer_id,
  //     permission_status: REJECTED,
  //     signature,
  //     expire_date
  //   };
  //   const valid = validatePostPermissionSchema(data, genPostPermissionSchema(data));
  //   expect(valid[0]).toBe(false);
  //   const { dataPath, message } = valid[1][0];
  //   expect(dataPath).toEqual('');
  //   expect(message).toEqual('should have required property \'reject_code\'');
  // });

  // it('should validate failed if permission status is REJECTED and reject_code is BVRC999 but missing reject_message', () => {
  //   const data = {
  //     transfer_id,
  //     permission_status: REJECTED,
  //     signature,
  //     expire_date,
  //     reject_code: RejectCode.BVRC999
  //   };
  //   const valid = validatePostPermissionSchema(data, genPostPermissionSchema(data));
  //   expect(valid[0]).toBe(false);
  //   const { dataPath, message } = valid[1][0];
  //   expect(dataPath).toEqual('');
  //   expect(message).toEqual('should have required property \'reject_message\'');
  // });

  it('should validate success', () => {
    const data = {
      transfer_id,
      permission_status,
      signature
    };
    const valid = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid[0]).toBe(true);

    data.permission_status = REJECTED;
    data.reject_code = RejectCode.BVRC001;
    const valid1 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid1[0]).toBe(true);

    data.reject_code = RejectCode.BVRC999;
    data.reject_message = '123';
    const valid2 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid2[0]).toBe(true);

    data.expire_date = expire_date;
    const valid3 = validatePostPermissionSchema(data, genPostPermissionSchema(data));
    expect(valid3[0]).toBe(true);
  });

});