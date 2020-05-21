const { FAKE_PRIVATE_KEY, FAKE_PUBLIC_KEY } = require('../fakeKeys');

const { validatePrivateKey } = require('../../src/utils');

jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  validatePrivateKey: jest.fn(),
}));

describe('test signCallback', () => {
  let crypto;
  jest.isolateModules(() => {
    crypto = require('../../src/crypto');
  });

  describe('test mock', () => {
    const callback_url = 'https://api.sygna.io/api/v1.1.0/bridge/';

    const crypto = require('../../src/crypto');
    crypto.signObject = jest.fn();

    const { signCallBack } = crypto;
    beforeEach(() => {
      crypto.signObject.mockReset();
      validatePrivateKey.mockClear();
    });

    it('should validatePrivateKey be called with correct parameters if signCallBack is called', () => {
      const fakeData = {
        callback_url,
      };
      signCallBack(fakeData, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signCallBack(fakeData, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => {
        throw new Error('error from validatePrivateKey');
      });
      try {
        signCallBack(fakeData, 'def');
        fail('expected error was not occurred');
      } catch (error) {
        const { message } = error;
        expect(message).toEqual('error from validatePrivateKey');
      }
      validatePrivateKey.mockReset();
    });

    it('should signObject be called with correct parameters if signCallBack is called', () => {
      const fakeData = {
        callback_url,
      };
      signCallBack(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(
        JSON.stringify(fakeData),
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);
    });
  });

  describe('test signature', () => {
    const callback_url = 'https://api.sygna.io/api/v1.1.0/bridge/';
    const callback_url1 = 'https://api.sygna.io/api/v1/bridge/';
    const { signCallBack, verifyObject } = crypto;
    it('should object which is return by signCallback be correct', () => {
      const fakeData = { callback_url };
      const signature = signCallBack(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...fakeData,
          signature:
            '2cf2aaf91bf0056078542204a97d3462c17586f46b1e4fb63fc418a6c7f8e27f37f61a85a8425774b77466c2f5042352b295aa7d584fcf70bbadaf3ebbaef2bd',
        }),
      );
      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      fakeData.callback_url = callback_url1;
      const signature1 = signCallBack(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature1)).toBe(
        JSON.stringify({
          ...fakeData,
          signature:
            'b83173eac4cf28525e2ee4521eacbc22423b5c4782568c9c3bf55ecdbe72aab7445518fa832019d3b888b9b859a7d995d6d4189b762db2ab5c15dd521fc939f1',
        }),
      );
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);
    });
  });
});
