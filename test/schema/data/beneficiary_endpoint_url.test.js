const {
  validateBeneficiaryEndpointUrlSchema,
} = require('../../../src/utils/validateSchema');

describe('test validate beneficiary_endpoint_url_schema', () => {
  const vasp_code = 'QQQQKRQQ';
  const beneficiary_endpoint_url = 'https://api.sygna.io/api/v1.1.0/bridge/';

  it('should validate failed if vasp_code is not valid', () => {
    const data = {};
    const valid = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property 'vasp_code'");

    data.vasp_code = 123;
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

  it('should validate failed if beneficiary_endpoint_url is not valid', () => {
    const data = { vasp_code };
    const valid = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual(
      "should have required property 'beneficiary_endpoint_url'",
    );

    data.beneficiary_endpoint_url = 123;
    const valid1 = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.beneficiary_endpoint_url');
    expect(message1).toEqual('should be string');

    data.beneficiary_endpoint_url = 'abcde';
    const valid2 = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.beneficiary_endpoint_url');
    expect(message2).toEqual('should match format "uri"');
  });

  it('should validate success', () => {
    const data = {
      vasp_code,
      beneficiary_endpoint_url,
    };
    const valid = validateBeneficiaryEndpointUrlSchema(data);
    expect(valid[0]).toBe(true);
  });
});
