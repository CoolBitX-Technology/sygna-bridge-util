const {
  validatePostBeneficiaryEndpointUrlSchema,
} = require('../../../src/utils/validateSchema');

describe('test validate post_beneficiary_endpoint_url', () => {
  const vasp_code = 'QQQQKRQQ';
  const beneficiary_endpoint_url = 'http://google.com';
  const signature =
    '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

  it('should validate failed if vasp_code is not valid', () => {
    const data = {};
    const valid = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property 'vasp_code'");

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

  it('should validate failed if beneficiary_endpoint_url is not valid', () => {
    const data = { vasp_code };
    const valid = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual(
      "should have required property 'beneficiary_endpoint_url'",
    );

    data.beneficiary_endpoint_url = 123;
    const valid1 = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.beneficiary_endpoint_url');
    expect(message1).toEqual('should be string');

    data.beneficiary_endpoint_url = 'abcde';
    const valid2 = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.beneficiary_endpoint_url');
    expect(message2).toEqual('should match format "uri"');
  });

  it('should validate failed if signature is not valid', () => {
    const data = {
      vasp_code,
      beneficiary_endpoint_url,
    };
    const valid = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property 'signature'");

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
      beneficiary_endpoint_url,
      signature,
    };
    const valid = validatePostBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(true);
  });
});
