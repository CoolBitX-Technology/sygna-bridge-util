const {
  validateResPostPermissionRequestSchema,
} = require('../../../src/utils/validateSchema');

describe('test validate res_post_permission_request_schema', () => {
  const transfer_id =
    '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

  it('should validate failed if status is not valid', () => {
    const data = {};
    const valid = validateResPostPermissionRequestSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property 'transfer_id'");

    data.transfer_id = 123;
    const valid1 = validateResPostPermissionRequestSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transfer_id');
    expect(message1).toEqual('should be string');

    data.transfer_id = '';
    const valid2 = validateResPostPermissionRequestSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transfer_id');
    expect(message2).toEqual('should NOT be shorter than 64 characters');

    data.transfer_id =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid3 = validateResPostPermissionRequestSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.transfer_id');
    expect(message3).toEqual('should NOT be longer than 64 characters');
  });

  it('should validate success', () => {
    const data = { transfer_id };
    const valid = validateResPostPermissionRequestSchema(data);
    expect(valid[0]).toBe(true);
  });
});
