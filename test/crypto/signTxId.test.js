const { FAKE_PRIVATE_KEY, FAKE_PUBLIC_KEY } = require('../fakeKeys');

const { validatePrivateKey } = require('../../src/utils');

jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
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
      crypto.signObject.mockReset();
      validatePrivateKey.mockClear();
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
      signTxId(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(
        JSON.stringify(fakeData),
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
      const signature = signTxId(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...fakeData,
          signature:
            '86a238c9fdba67bbe8b197e112e49c76c25ac9b22397e5467e459a4cf7a0a74c13851c4f6788af9c2592e521dad3bea0d7792c9a608e66f090e971cffa9c909b',
        }),
      );
      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      fakeData.txid =
        '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe375d';
      const signature1 = signTxId(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature1)).toBe(
        JSON.stringify({
          ...fakeData,
          signature:
            'bd318f858fbd684e7ac04a78e5485a7c9aa5eec9f4c906f976a6ea521341b1a80efe8119b000c2d612923fcad69ecc5fd6cd75948d3b10d217bddcd3139970e7',
        }),
      );
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);
    });
  });
});
