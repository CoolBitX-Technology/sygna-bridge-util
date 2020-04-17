const { FAKE_PRIVATE_KEY, FAKE_PUBLIC_KEY } = require('../fakeKeys');

const {
  validateTxIdSchema,
  validatePrivateKey,
  sortTxIdData,
} = require('../../src/utils');

jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  validateTxIdSchema: jest.fn().mockReturnValue([true]),
  validatePrivateKey: jest.fn(),
}));

describe('test signTxId', () => {
  let crypto;
  jest.isolateModules(() => {
    crypto = require('../../src/crypto');
  });

  describe('test mock', () => {
    const txid =
      '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe473d';
    const transfer_id =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

    const crypto = require('../../src/crypto');
    crypto.signObject = jest.fn();

    const { signTxId } = crypto;
    beforeEach(() => {
      validateTxIdSchema.mockClear();
      crypto.signObject.mockReset();
      validatePrivateKey.mockClear();
    });

    it('should validateTxIdSchema be called with correct parameters if signTxId is called', () => {
      const fakeData = {
        transfer_id,
        txid,
      };
      const fakeError = [
        {
          keyword: 'test',
          dataPath: '',
          schemaPath: '#/properties',
          params: { comparison: '>=' },
          message: `error from validateTxIdSchema`,
        },
      ];
      validateTxIdSchema.mockReset();

      validateTxIdSchema
        .mockReturnValueOnce([true])
        .mockReturnValue([false, fakeError]);

      signTxId(fakeData, FAKE_PRIVATE_KEY);
      expect(validateTxIdSchema.mock.calls.length).toBe(1);
      expect(validateTxIdSchema.mock.calls[0][0]).toEqual(fakeData);

      try {
        signTxId(fakeData, FAKE_PRIVATE_KEY);
        fail('expected error was not occurred');
      } catch (error) {
        const { keyword, message } = error[0];
        expect(keyword).toEqual('test');
        expect(message).toEqual('error from validateTxIdSchema');
      }
      expect(validateTxIdSchema.mock.calls.length).toBe(2);
      expect(validateTxIdSchema.mock.calls[1][0]).toEqual(fakeData);

      validateTxIdSchema.mockReturnValue([true]);
    });

    it('should validatePrivateKey be called with correct parameters if signTxId is called', () => {
      const fakeData = {
        transfer_id,
        txid,
      };
      signTxId(fakeData, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signTxId(fakeData, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => {
        throw new Error('error from validatePrivateKey');
      });
      try {
        signTxId(fakeData, 'def');
        fail('expected error was not occurred');
      } catch (error) {
        const { message } = error;
        expect(message).toEqual('error from validatePrivateKey');
      }
      validatePrivateKey.mockReset();
    });

    it('should signObject be called with correct parameters if signTxId is called', () => {
      const fakeData = {
        txid,
        transfer_id,
      };
      const sortedData = sortTxIdData(fakeData);
      signTxId(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(
        JSON.stringify(sortedData),
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);
    });
  });

  describe('test signature', () => {
    const txid =
      '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe473d';
    const transfer_id =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

    const { signTxId, verifyObject } = crypto;
    it('should object which is return by signTxId be correct', () => {
      const fakeData = { txid, transfer_id };
      const sortedData = sortTxIdData(fakeData);
      const signature = signTxId(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...sortedData,
          signature:
            '637b90ee3cf2fcb97fa155f7d99228ac41134ac01803575242b496166eac11ab4eb4d132829a2fda83ed9ee3d8b90c5360f752d8969b929344c73141ff03d318',
        }),
      );
      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      fakeData.txid =
        '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe375d';
      const sortedData1 = sortTxIdData(fakeData);
      const signature1 = signTxId(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature1)).toBe(
        JSON.stringify({
          ...sortedData1,
          signature:
            '30326aab59c7cbd2a04fc957ff2d3baa91bf3e4279db35735e48321b8cf973bd52f2aa64f6304e38a4f2f4b87f6f4b81eec0aa2dea4f00b34e2beddc74e795f7',
        }),
      );
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);
    });
  });
});
