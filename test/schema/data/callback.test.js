const { validateCallbackSchema } = require('../../../src/utils/validateSchema');
const callback_schema = require('../../../src/schema/data/callback.json');

describe('test validate callback_schema', () => {
  const callback_url = "http://google.com";
  const signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
  it('should validate failed if callback_url is not valid', () => {
    const data = {};
    const valid = validateCallbackSchema(data, callback_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'callback_url\'');

    data.callback_url = 123;
    const valid1 = validateCallbackSchema(data, callback_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.callback_url');
    expect(message1).toEqual('should be string');

    data.callback_url = 'abcde';
    const valid2 = validateCallbackSchema(data, callback_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.callback_url');
    expect(message2).toEqual('should match format \"uri\"');
  });

  it('should validate failed if signature is not valid', () => {
    const data = {
      callback_url
    };
    const valid = validateCallbackSchema(data, callback_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'signature\'');

    data.signature = 0;
    const valid2 = validateCallbackSchema(data, callback_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.signature');
    expect(message2).toEqual('should be string');

    data.signature = '';
    const valid3 = validateCallbackSchema(data, callback_schema);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.signature');
    expect(message3).toEqual('should NOT be shorter than 128 characters');

    data.signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid4 = validateCallbackSchema(data, callback_schema);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.signature');
    expect(message4).toEqual('should NOT be longer than 128 characters');

    data.signature = '6b86b273ff34fce19d6b804egg5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const valid5 = validateCallbackSchema(data, callback_schema);
    expect(valid5[0]).toBe(false);
    const { dataPath: dataPath5, message: message5 } = valid5[1][0];
    expect(dataPath5).toEqual('.signature');
    expect(message5).toEqual('should match pattern \"^[0123456789A-Fa-f]+$\"');

  });

  it('should validate success', () => {
    const data = {
      callback_url,
      signature
    };
    const valid = validateCallbackSchema(data, callback_schema);
    expect(valid[0]).toBe(true);

  });
});
