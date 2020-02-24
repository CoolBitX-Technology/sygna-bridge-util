
const { validateResRetrySchema } = require('../../../src/utils/validateSchema');
const res_retry_schema = require('../../../src/schema/api_response/res_retry.json');

describe('test validate res_retry_schema', () => {
  const retryItems = 1;

  it('should validate failed if retryItems is not valid', () => {
    const data = {};
    const valid = validateResRetrySchema(data, res_retry_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'retryItems\'');

    data.retryItems = '123';
    const valid1 = validateResRetrySchema(data, res_retry_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.retryItems');
    expect(message1).toEqual('should be number');

    data.retryItems = '';
    const valid2 = validateResRetrySchema(data, res_retry_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.retryItems');
    expect(message2).toEqual('should be number');

    data.retryItems = -1;
    const valid3 = validateResRetrySchema(data, res_retry_schema);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.retryItems');
    expect(message3).toEqual('should be >= 0');
  });

  it('should validate success', () => {
    const data = { retryItems };
    const valid = validateResRetrySchema(data, res_retry_schema);
    expect(valid[0]).toBe(true);

    data.retryItems = 0;
    const valid1 = validateResRetrySchema(data, res_retry_schema);
    expect(valid1[0]).toBe(true);
  });
});