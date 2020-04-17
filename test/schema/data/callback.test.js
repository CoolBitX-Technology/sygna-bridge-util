const { validateCallbackSchema } = require('../../../src/utils/validateSchema');

describe('test validate callback_schema', () => {
  const callback_url = 'http://google.com';
  it('should validate failed if callback_url is not valid', () => {
    const data = {};
    const valid = validateCallbackSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property 'callback_url'");

    data.callback_url = 123;
    const valid1 = validateCallbackSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.callback_url');
    expect(message1).toEqual('should be string');

    data.callback_url = 'abcde';
    const valid2 = validateCallbackSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.callback_url');
    expect(message2).toEqual('should match format "uri"');
  });

  it('should validate success', () => {
    const data = {
      callback_url,
    };
    const valid = validateCallbackSchema(data);
    expect(valid[0]).toBe(true);
  });
});
