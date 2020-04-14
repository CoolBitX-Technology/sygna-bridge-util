const { FAKE_PRIVATE_KEY, FAKE_PUBLIC_KEY } = require('../fakeKeys');

const {
  validateBeneficiaryEndpointUrlSchema,
  validatePrivateKey,
  sortBeneficiaryEndpointUrlData,
} = require('../../src/utils');

jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  validateBeneficiaryEndpointUrlSchema: jest.fn().mockReturnValue([true]),
  validatePrivateKey: jest.fn(),
}));

describe('test signBeneficiaryEndpointUrl', () => {
  const vasp_code = 'QQQQKRQQ';
  const beneficiary_endpoint_url = 'http://google.com';

  let crypto;
  jest.isolateModules(() => {
    crypto = require('../../src/crypto');
  });

  describe('test mock', () => {
    const crypto = require('../../src/crypto');
    crypto.signObject = jest.fn();

    const { signBeneficiaryEndpointUrl } = crypto;
    beforeEach(() => {
      validateBeneficiaryEndpointUrlSchema.mockClear();
      crypto.signObject.mockReset();
      validatePrivateKey.mockClear();
    });

    it('should validateBeneficiaryEndpointUrlSchema be called with correct parameters if signBeneficiaryEndpointUrl is called', () => {
      const fakeData = {
        vasp_code,
        beneficiary_endpoint_url,
      };
      const fakeError = [
        {
          keyword: 'test',
          dataPath: '',
          schemaPath: '#/properties',
          params: { comparison: '>=' },
          message: `error from validateBeneficiaryEndpointUrlSchema`,
        },
      ];
      validateBeneficiaryEndpointUrlSchema.mockReset();

      validateBeneficiaryEndpointUrlSchema
        .mockReturnValueOnce([true])
        .mockReturnValue([false, fakeError]);

      signBeneficiaryEndpointUrl(fakeData, FAKE_PRIVATE_KEY);
      expect(validateBeneficiaryEndpointUrlSchema.mock.calls.length).toBe(1);
      expect(validateBeneficiaryEndpointUrlSchema.mock.calls[0][0]).toEqual(
        fakeData,
      );

      try {
        signBeneficiaryEndpointUrl(fakeData, FAKE_PRIVATE_KEY);
        fail('expected error was not occurred');
      } catch (error) {
        const { keyword, message } = error[0];
        expect(keyword).toEqual('test');
        expect(message).toEqual(
          'error from validateBeneficiaryEndpointUrlSchema',
        );
      }
      expect(validateBeneficiaryEndpointUrlSchema.mock.calls.length).toBe(2);
      expect(validateBeneficiaryEndpointUrlSchema.mock.calls[1][0]).toEqual(
        fakeData,
      );

      validateBeneficiaryEndpointUrlSchema.mockReturnValue([true]);
    });

    it('should validatePrivateKey be called with correct parameters if signBeneficiaryEndpointUrl is called', () => {
      const fakeData = {
        vasp_code,
        beneficiary_endpoint_url,
      };
      signBeneficiaryEndpointUrl(fakeData, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signBeneficiaryEndpointUrl(fakeData, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => {
        throw new Error('error from validatePrivateKey');
      });
      try {
        signBeneficiaryEndpointUrl(fakeData, 'def');
        fail('expected error was not occurred');
      } catch (error) {
        const { message } = error;
        expect(message).toEqual('error from validatePrivateKey');
      }
      validatePrivateKey.mockReset();
    });

    it('should signObject be called with correct parameters if signTxId is called', () => {
      const fakeData = {
        vasp_code,
        beneficiary_endpoint_url,
      };
      const sortedData = sortBeneficiaryEndpointUrlData(fakeData);
      signBeneficiaryEndpointUrl(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(
        JSON.stringify(sortedData),
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);
    });
  });

  describe('test signature', () => {
    const { signBeneficiaryEndpointUrl, verifyObject } = crypto;
    it('should object which is return by signCallback be correct', () => {
      const fakeData = { beneficiary_endpoint_url, vasp_code };
      const sortedData = sortBeneficiaryEndpointUrlData(fakeData);
      const signature = signBeneficiaryEndpointUrl(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...sortedData,
          signature:
            '2c9339dd88f89f60280d66575c3c6868f3e12b56838538ebf5bed7d148cfa5c96ac7ef9365a3b67eacff8fca4d7c10f9f226089a9947a1408d1d09416325ba6d',
        }),
      );
      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);
    });
  });
});
