const { FAKE_PRIVATE_KEY, FAKE_PUBLIC_KEY } = require('../fakeKeys');

const { validatePrivateKey } = require('../../src/utils');

jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  validatePrivateKey: jest.fn(),
}));

describe('test signBeneficiaryEndpointUrl', () => {
  const vasp_code = 'VASPUSNY1';
  const callback_permission_request_url =
    'https://api.sygna.io/v2/bridge/permission-request';
  const callback_txid_url = 'https://api.sygna.io/v2/bridge/txid';
  const callback_validate_addr_url =
    'https://api.sygna.io/v2/bridge/permission-request';

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
            'f0f80cbf7ae85ab54f49797f99ec4905a83db0ea774cf4c76d07a66620b8b18107e2f34237d7a0ba595d423da5bd88602a075d7e3d8934eedc551aeeccb3d1fd',
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
            '62b7a73f9050b9c4524a101c46b8fe3f285079448a6e1b37d1618185396df54a062a918914a0bc99ff219f64d5443151f7b9b3aa4ad25d606bb1c72c98ddfc69',
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
            '14b56544a0fb0069afa13d277f394140162b6710346ca298b12ebc9e5d1be12b11b564485b2eadf03d4f78b4ded0610c6b60ad332935331e9d1e1889f212c3f2',
        }),
      );
      const isValid2 = verifyObject(signature2, FAKE_PUBLIC_KEY);
      expect(isValid2).toBe(true);

      const fakeData3 = {
        callback_txid_url,
        vasp_code,
        callback_permission_request_url,
        callback_validate_addr_url,
      };

      const signature3 = signBeneficiaryEndpointUrl(
        fakeData3,
        FAKE_PRIVATE_KEY,
      );
      expect(JSON.stringify(signature3)).toBe(
        JSON.stringify({
          ...fakeData3,
          signature:
            'f25a96885d61394fedea6133f0b57da1b730d9398decb77d72286ea57b6d6ee25fa17e5f8365eb93e75cb26b56d5d2cc9cdea670e51ca71646e27f891aa0b8cc',
        }),
      );
      const isValid3 = verifyObject(signature3, FAKE_PUBLIC_KEY);
      expect(isValid3).toBe(true);
    });
  });
});
