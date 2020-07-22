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
    const callback_url = 'https://api.sygna.io/v2/bridge/';

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
    const callback_url = 'https://api.sygna.io/v2/bridge/';
    const { signCallBack, verifyObject } = crypto;
    it('should object which is return by signCallback be correct', () => {
      const fakeData = { callback_url };
      const signature = signCallBack(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...fakeData,
          signature:
            '825a820f4e331acc6f53a0b745b7caba139c922131f9356f7b4d914040b9d3fa469764289e81cf989a5c143aa9f0ae88fc1357ca81584041b09639faab178672',
        }),
      );
      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);
    });
  });
});
