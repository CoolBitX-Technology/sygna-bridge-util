const {
  validateBeneficiaryEndpointUrlSchema,
} = require('../../../src/utils/validateSchema');

describe('test validate callback_permission_request_url_schema', () => {
  const vasp_code = 'QQQQKRQQ';
  const callback_permission_request_url =
    'https://api.sygna.io/api/v1.1.0/bridge/permission-request';
  const callback_txid_url = 'https://api.sygna.io/api/v1.1.0/bridge/txid';

  it('should validate failed if vasp_code is not valid', () => {
    const data = {};
    const valid = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property '.vasp_code'");

    data.vasp_code = 123;
    data.callback_permission_request_url = callback_permission_request_url;
    const valid1 = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.vasp_code');
    expect(message1).toEqual('should be string');

    data.vasp_code = '';
    const valid2 = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.vasp_code');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if callback_permission_request_url and callback_txid_url are empty', () => {
    const data = { vasp_code };
    const valid = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(false);
    const messages = valid[1];
    expect(messages.length).toBe(3);
    const { dataPath, message } = messages[0];
    expect(dataPath).toEqual('');
    expect(message).toEqual(
      "should have required property '.callback_permission_request_url'",
    );

    const { dataPath: dataPath1, message: message1 } = messages[1];
    expect(dataPath1).toEqual('');
    expect(message1).toEqual(
      "should have required property '.callback_txid_url'",
    );

    const { dataPath: dataPath2, message: message2 } = messages[2];
    expect(dataPath2).toEqual('');
    expect(message2).toEqual('should match some schema in anyOf');
  });

  it('should validate failed if callback_permission_request_url is not valid', () => {
    const data = { vasp_code };
    data.callback_permission_request_url = 123;
    const valid = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.callback_permission_request_url');
    expect(message).toEqual('should be string');

    data.callback_permission_request_url = 'abcde';
    const valid1 = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.callback_permission_request_url');
    expect(message1).toEqual('should match format "uri"');
  });

  it('should validate failed if callback_txid_url is not valid', () => {
    const data = { vasp_code };
    data.callback_txid_url = 123;
    const valid = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.callback_txid_url');
    expect(message).toEqual('should be string');

    data.callback_txid_url = 'abcde';
    const valid1 = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.callback_txid_url');
    expect(message1).toEqual('should match format "uri"');
  });

  it('should validate success', () => {
    const data = {
      vasp_code,
      callback_permission_request_url,
    };
    const valid = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(true);

    const data1 = {
      vasp_code,
      callback_txid_url,
    };
    const valid1 = validateBeneficiaryEndpointUrlSchema(data1);
    expect(valid1[0]).toBe(true);

    const data2 = {
      vasp_code,
      callback_permission_request_url,
      callback_txid_url,
    };
    const valid2 = validateBeneficiaryEndpointUrlSchema(data2);
    expect(valid2[0]).toBe(true);
  });
});
