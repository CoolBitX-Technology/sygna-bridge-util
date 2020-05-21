const { FAKE_PRIVATE_KEY, FAKE_PUBLIC_KEY } = require('../fakeKeys');

const { validatePrivateKey } = require('../../src/utils');

jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
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
      crypto.signObject.mockReset();
      validatePrivateKey.mockClear();
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
      signBeneficiaryEndpointUrl(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(
        JSON.stringify(fakeData),
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);
    });
  });

  describe('test signature', () => {
    const { signBeneficiaryEndpointUrl, verifyObject } = crypto;
    it('should object which is return by signBeneficiaryEndpointUrl be correct', () => {
      const fakeData = { callback_permission_request_url, vasp_code };
      const signature = signBeneficiaryEndpointUrl(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...fakeData,
          signature:
            'bcc1f78ee790b19dfdc9b2395f395f2e73e05b9171c7f1ef8e5c36243ae1a7d149bedfe18bdbf80747ad726b06f607bd01aad552279a9c0811b63eba29937dde',
        }),
      );
      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      const fakeData1 = { callback_txid_url, vasp_code };
      const signature1 = signBeneficiaryEndpointUrl(
        fakeData1,
        FAKE_PRIVATE_KEY,
      );
      expect(JSON.stringify(signature1)).toBe(
        JSON.stringify({
          ...fakeData1,
          signature:
            'f0823dc79748576c525b0a502ebd32bbf3f14b7f017c06e48b6f8d0b5ffa1cc123b256032addbd4bc8017e0786b8365550c8a3fbda3d660949419ac2f6412737',
        }),
      );
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);

      const fakeData2 = {
        callback_txid_url,
        vasp_code,
        callback_permission_request_url,
      };

      const signature2 = signBeneficiaryEndpointUrl(
        fakeData2,
        FAKE_PRIVATE_KEY,
      );
      expect(JSON.stringify(signature2)).toBe(
        JSON.stringify({
          ...fakeData2,
          signature:
            '2d32548e95ad7341ab3479097fdd81b4cbe6d0b39e36ad3419a7654f6656ecff07a3ea55cdb773a9dc7fd6b2ccd29bef4f9088eed4545223f983c79dd40159b3',
        }),
      );
      const isValid2 = verifyObject(signature2, FAKE_PUBLIC_KEY);
      expect(isValid2).toBe(true);
    });
  });
});
