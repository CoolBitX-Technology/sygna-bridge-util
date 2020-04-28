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
  const vasp_code = 'VASPUSNY1';
  const callback_permission_request_url =
    'https://api.sygna.io/api/v1.1.0/bridge/permission-request';
  const callback_txid_url = 'https://api.sygna.io/api/v1.1.0/bridge/txid';

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
        callback_permission_request_url,
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
        callback_permission_request_url,
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

    it('should signObject be called with correct parameters if signBeneficiaryEndpointUrl is called', () => {
      const fakeData = {
        vasp_code,
        callback_permission_request_url,
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
    it('should object which is return by signBeneficiaryEndpointUrl be correct', () => {
      const fakeData = { callback_permission_request_url, vasp_code };
      const sortedData = sortBeneficiaryEndpointUrlData(fakeData);
      const signature = signBeneficiaryEndpointUrl(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...sortedData,
          signature:
            '0d02fa6a3661fa4cd9beeda27b04a1b990aa191307e6c192e943499855d49e2e7ebdec9fee5714fcb3b43d145fba13e02a9a7f5282fb270ad6c05a72cfe85ec4',
        }),
      );
      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      const fakeData1 = { callback_txid_url, vasp_code };
      const sortedData1 = sortBeneficiaryEndpointUrlData(fakeData1);
      const signature1 = signBeneficiaryEndpointUrl(
        fakeData1,
        FAKE_PRIVATE_KEY,
      );
      expect(JSON.stringify(signature1)).toBe(
        JSON.stringify({
          ...sortedData1,
          signature:
            '9520de437bc7f8bd47404fa630faeb2d0c408fc895245f29cc292fdac564a50853ccd5014415f01580361ad2cc317f0d45b940c21b6464fbedeaf7829dc11c76',
        }),
      );
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);

      const fakeData2 = {
        callback_txid_url,
        vasp_code,
        callback_permission_request_url,
      };
      const sortedData2 = sortBeneficiaryEndpointUrlData(fakeData2);
      const signature2 = signBeneficiaryEndpointUrl(
        fakeData2,
        FAKE_PRIVATE_KEY,
      );
      expect(JSON.stringify(signature2)).toBe(
        JSON.stringify({
          ...sortedData2,
          signature:
            'dfd9cd0a52ae368d8e149985791cedc3a52960fb67df15d327d7b9221f3ec1677d9f673ef75151c6f4964294f9bdce3e2dfc87a269c4f2b0722a809ad9f67e00',
        }),
      );
      const isValid2 = verifyObject(signature2, FAKE_PUBLIC_KEY);
      expect(isValid2).toBe(true);
    });
  });
});
