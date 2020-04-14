const { FAKE_PRIVATE_KEY, FAKE_PUBLIC_KEY } = require('../fakeKeys');

const {
  validateCallbackSchema,
  validatePrivateKey,
  sortCallbackData,
} = require('../../src/utils');

jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  validateCallbackSchema: jest.fn().mockReturnValue([true]),
  validatePrivateKey: jest.fn(),
}));

describe('test signCallback', () => {
  let crypto;
  jest.isolateModules(() => {
    crypto = require('../../src/crypto');
  });

  describe('test mock', () => {
    const callback_url = 'http://google.com';

    const crypto = require('../../src/crypto');
    crypto.signObject = jest.fn();

    const { signCallBack } = crypto;
    beforeEach(() => {
      validateCallbackSchema.mockClear();
      crypto.signObject.mockReset();
      validatePrivateKey.mockClear();
    });

    it('should validateCallbackSchema be called with correct parameters if signCallBack is called', () => {
      const fakeData = {
        callback_url,
      };
      const fakeError = [
        {
          keyword: 'test',
          dataPath: '',
          schemaPath: '#/properties',
          params: { comparison: '>=' },
          message: `error from validateCallbackSchema`,
        },
      ];
      validateCallbackSchema.mockReset();

      validateCallbackSchema
        .mockReturnValueOnce([true])
        .mockReturnValue([false, fakeError]);

      signCallBack(fakeData, FAKE_PRIVATE_KEY);
      expect(validateCallbackSchema.mock.calls.length).toBe(1);
      expect(validateCallbackSchema.mock.calls[0][0]).toEqual(fakeData);

      try {
        signCallBack(fakeData, FAKE_PRIVATE_KEY);
        fail('expected error was not occurred');
      } catch (error) {
        const { keyword, message } = error[0];
        expect(keyword).toEqual('test');
        expect(message).toEqual('error from validateCallbackSchema');
      }
      expect(validateCallbackSchema.mock.calls.length).toBe(2);
      expect(validateCallbackSchema.mock.calls[1][0]).toEqual(fakeData);

      validateCallbackSchema.mockReturnValue([true]);
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
      const sortedData = sortCallbackData(fakeData);
      signCallBack(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(
        JSON.stringify(sortedData),
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);
    });
  });

  describe('test signature', () => {
    const callback_url = 'https://www.google.com.tw/';
    const callback_url1 = 'https://stackoverflow.com/';
    const { signCallBack, verifyObject } = crypto;
    it('should object which is return by signCallback be correct', () => {
      const fakeData = { callback_url };
      const sortedData = sortCallbackData(fakeData);
      const signature = signCallBack(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...sortedData,
          signature:
            '70523f954126b49ba96abed9cf0a28d2093bb8a8c3f04961e0de644c64ba959520a483b178502946e24e5f9a2ba3269310a883699cf9f72f5d92af00cd8d69fa',
        }),
      );
      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      fakeData.callback_url = callback_url1;
      const sortedData1 = sortCallbackData(fakeData);
      const signature1 = signCallBack(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature1)).toBe(
        JSON.stringify({
          ...sortedData1,
          signature:
            '36a5df2a18af5663f9ddc78e9895b5008fdc9b62c5a1a97adcd62e9ed96064420b3891f62d25391906710321419d3f8dd57edb4bd15e8520f029a074a1f1265c',
        }),
      );
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);
    });
  });
});
