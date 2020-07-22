const { FAKE_PRIVATE_KEY, FAKE_PUBLIC_KEY } = require('../fakeKeys');

const { ACCEPTED, REJECTED, RejectCode } = require('../../src/config');

const { validatePrivateKey } = require('../../src/utils');

jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  validatePrivateKey: jest.fn(),
}));

describe('test signPermission', () => {
  let crypto;
  jest.isolateModules(() => {
    crypto = require('../../src/crypto');
  });

  describe('test mock', () => {
    const transfer_id =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const permission_status = ACCEPTED;

    const crypto = require('../../src/crypto');
    crypto.signObject = jest.fn();

    const { signPermission } = crypto;
    beforeEach(() => {
      crypto.signObject.mockReset();
      validatePrivateKey.mockClear();
    });

    it('should validatePrivateKey be called with correct parameters if signPermission is called', () => {
      const fakeData = {
        transfer_id,
        permission_status,
      };
      signPermission(fakeData, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signPermission(fakeData, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => {
        throw new Error('error from validatePrivateKey');
      });
      try {
        signPermission(fakeData, 'def');
        fail('expected error was not occurred');
      } catch (error) {
        const { message } = error;
        expect(message).toEqual('error from validatePrivateKey');
      }
      validatePrivateKey.mockReset();
    });

    it('should signObject be called with correct parameters if signPermission is called', () => {
      const fakeData = {
        permission_status,
        transfer_id,
      };
      signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(
        JSON.stringify(fakeData),
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);

      fakeData.expire_date = 123;
      signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(2);
      expect(JSON.stringify(crypto.signObject.mock.calls[1][0])).toBe(
        JSON.stringify(fakeData),
      );
      expect(crypto.signObject.mock.calls[1][1]).toEqual(FAKE_PRIVATE_KEY);

      fakeData.permission_status = REJECTED;
      fakeData.reject_code = RejectCode.BVRC001;
      signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(3);
      expect(JSON.stringify(crypto.signObject.mock.calls[2][0])).toBe(
        JSON.stringify(fakeData),
      );
      expect(crypto.signObject.mock.calls[2][1]).toEqual(FAKE_PRIVATE_KEY);

      fakeData.reject_message = 'test';
      signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(4);
      expect(JSON.stringify(crypto.signObject.mock.calls[3][0])).toBe(
        JSON.stringify(fakeData),
      );
      expect(crypto.signObject.mock.calls[3][1]).toEqual(FAKE_PRIVATE_KEY);
    });
  });

  describe('test signature', () => {
    const transfer_id =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const permission_status = ACCEPTED;
    const { signPermission, verifyObject } = crypto;

    it('should object which is return by signPermission be correct', () => {
      const fakeData = {
        permission_status,
        transfer_id,
      };
      const signature = signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...fakeData,
          signature:
            '7969f5a533d51b49dc6343c4ec045ae9844f534ada712310402e2fa56b55894b1c493e25658b0c1c0afaf6560c2fbd70fa206619ea7896bf79975a844f6e1f67',
        }),
      );
      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      delete fakeData.signature;
      fakeData.expire_date = 2529024749000;
      const signature1 = signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature1)).toBe(
        JSON.stringify({
          ...fakeData,
          signature:
            '5112233cf9f54932a5fd0e4c52e2a08edb50734665c5e4edd0424d4e2b9a70c74e0b2fb26e8d8ddb0eb582453f6b1d840aca07295489782a0e3376396a3fe8fd',
        }),
      );
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);

      const fakeRejectedData = {
        permission_status: REJECTED,
        reject_code: RejectCode.BVRC001,
        transfer_id,
      };
      delete fakeRejectedData.signature;
      const signature2 = signPermission(fakeRejectedData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature2)).toBe(
        JSON.stringify({
          ...fakeRejectedData,
          signature:
            'e48226bfc363629ea6efc848341eb981663dcbf0a0bc1036d9d1f8c6f7384a002050f83bdad6628963231fb5681e761edc3af00920665d9903a673ce3c60d886',
        }),
      );
      const isValid2 = verifyObject(signature2, FAKE_PUBLIC_KEY);
      expect(isValid2).toBe(true);

      delete fakeRejectedData.signature;
      fakeRejectedData.reject_message = 'unsupported_currency';
      const signature3 = signPermission(fakeRejectedData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature3)).toBe(
        JSON.stringify({
          ...fakeRejectedData,
          signature:
            '1b14444eb0cfe62ec496126d025e4862112261ff87659fa11f76d123cf395bbf5c1cb3a1590c1a8a658ac8a3b27072375693a853e432346471fce964fdb76aea',
        }),
      );
      const isValid3 = verifyObject(signature3, FAKE_PUBLIC_KEY);
      expect(isValid3).toBe(true);

      fakeRejectedData.expire_date = 2529024749000;
      delete fakeRejectedData.signature;
      const signature4 = signPermission(fakeRejectedData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature4)).toBe(
        JSON.stringify({
          ...fakeRejectedData,
          signature:
            '2ac62c6ec59ce297677b80c02f072aee8bffbed6f788916f5fbbe0b36cd9e7cb5274ba2cf987c7c2f2ef7c8c9f5117ca2d69af9aaaf333bac36bb77bb34135ce',
        }),
      );
      const isValid4 = verifyObject(signature4, FAKE_PUBLIC_KEY);
      expect(isValid4).toBe(true);
    });
  });
});
