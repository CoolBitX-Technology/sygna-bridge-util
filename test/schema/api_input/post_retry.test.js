
const { validatePostRetrySchema } = require('../../../src/utils/validateSchema');
const post_retry_schema = require('../../../src/schema/api_input/post_retry.json');

describe('test validate post_retry_schema', () => {
  const vasp_code = '1234';

  it('should validate failed if vasp_code is not valid', () => {
    const data = {};
    const valid = validatePostRetrySchema(data, post_retry_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'vasp_code\'');

    data.vasp_code = 123;
    const valid1 = validatePostRetrySchema(data, post_retry_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.vasp_code');
    expect(message1).toEqual('should be string');

    data.vasp_code = '';
    const valid2 = validatePostRetrySchema(data, post_retry_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.vasp_code');
    expect(message2).toEqual('should NOT be shorter than 1 characters');

  });

  it('should validate success', () => {
    const data = { vasp_code };
    const valid = validatePostRetrySchema(data, post_retry_schema);
    expect(valid[0]).toBe(true);
  });
});