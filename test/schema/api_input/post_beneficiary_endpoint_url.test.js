const {
  validatePostBeneficiaryEndpointUrlSchema,
} = require('../../../src/utils/validateSchema');

describe('test validate post_beneficiary_endpoint_url', () => {
  const vasp_code = 'QQQQKRQQ';
  const callback_permission_request_url =
    'https://api.sygna.io/api/v1.1.0/bridge/permission-request';
  const callback_txid_url = 'https://api.sygna.io/api/v1.1.0/bridge/txid';
  const signature =
    '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

  it('should validate failed if vasp_code is not valid', () => {
    const data = {};
    const valid = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property '.vasp_code'");

    data.vasp_code = 123;
    const valid1 = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.vasp_code');
    expect(message1).toEqual('should be string');

    data.vasp_code = '';
    const valid2 = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.vasp_code');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if callback_permission_request_url and callback_txid_url are empty', () => {
    const data = { vasp_code };
    const valid = validatePostBeneficiaryEndpointUrlSchema(data);
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
    const valid = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid[1][0];
    expect(dataPath1).toEqual('.callback_permission_request_url');
    expect(message1).toEqual('should be string');

    data.callback_permission_request_url = 'abcde';
    const valid1 = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid1[1][0];
    expect(dataPath2).toEqual('.callback_permission_request_url');
    expect(message2).toEqual('should match format "uri"');
  });

  it('should validate failed if callback_txid_url is not valid', () => {
    const data = { vasp_code };
    data.callback_txid_url = 123;
    const valid = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid[1][0];
    expect(dataPath1).toEqual('.callback_txid_url');
    expect(message1).toEqual('should be string');

    data.callback_txid_url = 'abcde';
    const valid1 = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid1[1][0];
    expect(dataPath2).toEqual('.callback_txid_url');
    expect(message2).toEqual('should match format "uri"');
  });

  it('should validate failed if signature is not valid', () => {
    const data = {
      vasp_code,
      callback_permission_request_url,
    };
    const valid = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property '.signature'");

    data.signature = 0;
    const valid2 = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.signature');
    expect(message2).toEqual('should be string');

    data.signature = '';
    const valid3 = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.signature');
    expect(message3).toEqual('should NOT be shorter than 128 characters');

    data.signature =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid4 = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.signature');
    expect(message4).toEqual('should NOT be longer than 128 characters');

    data.signature =
      '6b86b273ff34fce19d6b804egg5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const valid5 = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid5[0]).toBe(false);
    const { dataPath: dataPath5, message: message5 } = valid5[1][0];
    expect(dataPath5).toEqual('.signature');
    expect(message5).toEqual('should match pattern "^[0123456789A-Fa-f]+$"');
  });

  it('should validate success', () => {
    const data = {
      vasp_code,
      callback_permission_request_url,
      signature,
    };
    const valid = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(true);

    const data1 = {
      vasp_code,
      callback_txid_url,
      signature,
    };
    const valid1 = validatePostBeneficiaryEndpointUrlSchema(data1);
    expect(valid1[0]).toBe(true);

    const data2 = {
      vasp_code,
      callback_permission_request_url,
      callback_txid_url,
      signature,
    };
    const valid2 = validatePostBeneficiaryEndpointUrlSchema(data2);
    expect(valid2[0]).toBe(true);
  });
});
