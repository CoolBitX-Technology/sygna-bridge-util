const { validateResOkSchema } = require('../../../src/utils/validateSchema');

describe('test validate res_ok', () => {
  it('should validate failed if status is not valid', () => {
    const data = {};
    const valid = validateResOkSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property 'status'");

    data.status = 123;
    const valid1 = validateResOkSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.status');
    expect(message1).toEqual('should be string');

    data.status = '';
    const valid2 = validateResOkSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.status');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate success', () => {
    const data = { status: '123' };
    const valid = validateResOkSchema(data);
    expect(valid[0]).toBe(true);

    data.status = '1';
    const valid1 = validateResOkSchema(data);
    expect(valid1[0]).toBe(true);
  });
});
