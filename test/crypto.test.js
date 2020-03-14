const {
  FAKE_PRIVATE_KEY,
  FAKE_PUBLIC_KEY,
} = require('./fakeKeys');

const {
  validatePermissionRequestSchema,
  validatePermissionSchema,
  validateCallbackSchema,
  validateTxIdSchema,
  validatePrivateKey,
  sortPermissionRequestData,
  sortPermissionData,
  sortCallbackData,
  sortTxIdData
} = require('../src/utils');

const {
  ACCEPTED,
  REJECTED,
  RejectCode
} = require('../src/config');

jest.mock('../src/utils', () => ({
  ...jest.requireActual('../src/utils'),
  validatePermissionRequestSchema: jest.fn().mockReturnValue([true]),
  validatePermissionSchema: jest.fn().mockReturnValue([true]),
  validateCallbackSchema: jest.fn().mockReturnValue([true]),
  validateTxIdSchema: jest.fn().mockReturnValue([true]),
  validatePrivateKey: jest.fn()
}));

describe('test crypto', () => {
  let crypto;
  jest.isolateModules(() => {
    crypto = require('../src/crypto');
  });

  describe('test sygnaEncodePrivateObj and sygnaDecodePrivateObj', () => {
    it('should decode encoded object to original object', () => {
      const fakeData = {
        'originator': {
          'name': 'Antoine Griezmann',
          'date_of_birth': '1991-03-21',
        },
        'beneficiary': {
          'name': 'Leo Messi'
        }
      };
      const encodedPrivateData = crypto.sygnaEncodePrivateObj(fakeData, FAKE_PUBLIC_KEY);
      const decodedPrivateData = crypto.sygnaDecodePrivateObj(encodedPrivateData, FAKE_PRIVATE_KEY);
      expect(decodedPrivateData).toEqual(fakeData);
    });

    it('should decode encoded string to original string', () => {
      const fakeData = "qwer";
      const encodedPrivateData = crypto.sygnaEncodePrivateObj(fakeData, FAKE_PUBLIC_KEY);
      const decodedPrivateData = crypto.sygnaDecodePrivateObj(encodedPrivateData, FAKE_PRIVATE_KEY);
      expect(decodedPrivateData).toEqual(fakeData);
    });
  });

  describe('test signPermissionRequest', () => {
    const crypto = require('../src/crypto');
    crypto.signObject = jest.fn();

    const { signPermissionRequest } = crypto;
    beforeEach(() => {
      crypto.signObject.mockClear();
      validatePermissionRequestSchema.mockClear();
      validatePrivateKey.mockClear();
    });

    it('should validatePermissionRequestSchema be called with correct parameters if signPermissionRequest is called', () => {
      const fakeData = {
        data_dt: '2019-07-29T06:29:00.123Z',
        private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        signature: '1234567890',
        transaction: {
          transaction_currency: '0x80000000',
          originator_addrs: [
            '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
          ],
          originator_vasp_code: 'VASPTWTP1',
          beneficiary_addrs: [
            '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
          ],
          amount: 1,
          beneficiary_vasp_code: 'VASPTWTP2'
        }
      }
      const fakeError = [
        {
          "keyword": "test",
          "dataPath": "",
          "schemaPath": "#/properties",
          "params": { "comparison": ">=" },
          "message": `error from validatePermissionRequestSchema`
        }
      ]
      validatePermissionRequestSchema.mockReset();

      validatePermissionRequestSchema
        .mockReturnValueOnce([true])
        .mockReturnValue([false, fakeError]);

      signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      expect(validatePermissionRequestSchema.mock.calls.length).toBe(1);
      expect(validatePermissionRequestSchema.mock.calls[0][0]).toEqual(fakeData);

      try {
        signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
        fail('expected error was not occurred');
      } catch (error) {
        const { keyword, message } = error[0];
        expect(keyword).toEqual('test');
        expect(message).toEqual('error from validatePermissionRequestSchema');
      }
      expect(validatePermissionRequestSchema.mock.calls.length).toBe(2);
      expect(validatePermissionRequestSchema.mock.calls[1][0]).toEqual(fakeData);

      validatePermissionRequestSchema.mockReturnValue([true])
    });

    it('should validatePrivateKey be called with correct parameters if signPermissionRequest is called', () => {
      const fakeData = {
        data_dt: '2019-07-29T06:29:00.123Z',
        private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        signature: '1234567890',
        transaction: {
          transaction_currency: '0x80000000',
          originator_addrs: [
            '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
          ],
          originator_vasp_code: 'VASPTWTP1',
          beneficiary_addrs: [
            '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
          ],
          amount: 1,
          beneficiary_vasp_code: 'VASPTWTP2'
        }
      };

      signPermissionRequest(fakeData, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signPermissionRequest(fakeData, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => { throw new Error('error from validatePrivateKey'); });
      try {
        signPermissionRequest(fakeData, 'def');
        fail('expected error was not occurred');
      } catch (error) {
        const { message } = error;
        expect(message).toEqual('error from validatePrivateKey');
      }
      validatePrivateKey.mockReset();
    });

    it('should signObject be called with correct parameters if signPermissionRequest is called', () => {
      const fakeData = {
        data_dt: '2019-07-29T06:29:00.123Z',
        private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        signature: '1234567890',
        transaction: {
          transaction_currency: '0x80000000',
          originator_addrs: [
            '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
          ],
          originator_vasp_code: 'VASPTWTP1',
          beneficiary_addrs: [
            '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
          ],
          amount: 1,
          beneficiary_vasp_code: 'VASPTWTP2'
        }
      };
      signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(JSON.stringify(sortPermissionRequestData(fakeData)));
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);

      fakeData.expire_date = 123;
      signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(2);
      expect(JSON.stringify(crypto.signObject.mock.calls[1][0])).toBe(JSON.stringify(sortPermissionRequestData(fakeData)));
      expect(crypto.signObject.mock.calls[1][1]).toEqual(FAKE_PRIVATE_KEY);
    });
  });

  describe('test signPermissionRequest signature', () => {
    const { signPermissionRequest, verifyObject } = crypto;

    it('should object which is return by signPermissionRequest be correct', () => {
      const fakeData = {
        data_dt: '2019-07-29T06:29:00.123Z',
        private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        transaction: {
          transaction_currency: '0x80000000',
          originator_addrs: [
            '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
          ],
          originator_vasp_code: 'VASPTWTP1',
          beneficiary_addrs: [
            '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
          ],
          amount: 1,
          beneficiary_vasp_code: 'VASPTWTP2'
        }
      };
      const signature = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      const sortedFakeData = sortPermissionRequestData(fakeData);
      expect(JSON.stringify(signature)).toBe(JSON.stringify(
        {
          ...sortedFakeData,
          signature: "c7b9c1edc35e17dc0a78858d68786e5bcb26bbc09d02a0e1747e7eeabdc59d4e79c6d1156359a06b1662084d782bd86f4bdc6cc5aa6696f20c5ea8e20fa328e8"
        }
      ));

      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      fakeData.expire_date = 2529024749000;
      const signature1 = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      const sortedFakeData1 = sortPermissionRequestData(fakeData);
      expect(JSON.stringify(signature1)).toBe(JSON.stringify(
        {
          ...sortedFakeData1,
          signature: "2727bc6be48b780bfd4712c2f8bfa39bcc24e7e2aa48e8fbfa02789b8bac31443c8dc991731108bddabc52761dc9bf97cb5938838c3c28fae1c4fcd31e5a7c5c"
        }
      ));
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);

      fakeData.transaction.originator_addrs_extra = { 'DT': '001' };
      const signature2 = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      const sortedFakeData2 = sortPermissionRequestData(fakeData);
      expect(JSON.stringify(signature2)).toBe(JSON.stringify(
        {
          ...sortedFakeData2,
          signature: "c758a58cc6920a3179c45a467d5cd7e297ba725c0c6fafd391f15e7345de7592344f8fa6f9a7c5433dd4e43da08f4d27ad17b2664697218df9bf7bce18fcd841"
        }
      ));
      const isValid2 = verifyObject(signature2, FAKE_PUBLIC_KEY);
      expect(isValid2).toBe(true);

      fakeData.transaction.beneficiary_addrs_extra = { 'DT': '002' };
      const signature3 = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      const sortedFakeData3 = sortPermissionRequestData(fakeData);
      expect(JSON.stringify(signature3)).toBe(JSON.stringify(
        {
          ...sortedFakeData3,
          signature: "0b647c4803731fb6aa58613f979d38e01e1f69d953a104a326941c1700e2b2d6450da8d26f7490c323ec340c0274996b38527649f3cc4ef4fbfd65af69afbe28"
        }
      ));
      const isValid3 = verifyObject(signature3, FAKE_PUBLIC_KEY);
      expect(isValid3).toBe(true);

    });

  });

  describe('test signPermission', () => {
    const transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const permission_status = ACCEPTED;

    const crypto = require('../src/crypto');
    crypto.signObject = jest.fn();

    const { signPermission } = crypto;
    beforeEach(() => {
      validatePermissionSchema.mockClear();
      crypto.signObject.mockReset();
      validatePrivateKey.mockClear();
    });

    it('should validatePermissionSchema be called with correct parameters if signPermission is called', () => {
      const fakeData = {
        transfer_id,
        permission_status
      }
      const fakeError = [
        {
          "keyword": "test",
          "dataPath": "",
          "schemaPath": "#/properties",
          "params": { "comparison": ">=" },
          "message": `error from validatePermissionSchema`
        }
      ]
      validatePermissionSchema.mockReset();

      validatePermissionSchema
        .mockReturnValueOnce([true])
        .mockReturnValue([false, fakeError]);

      signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(validatePermissionSchema.mock.calls.length).toBe(1);
      expect(validatePermissionSchema.mock.calls[0][0]).toEqual(fakeData);

      try {
        signPermission(fakeData, FAKE_PRIVATE_KEY);
        fail('expected error was not occurred');
      } catch (error) {
        const { keyword, message } = error[0];
        expect(keyword).toEqual('test');
        expect(message).toEqual('error from validatePermissionSchema');
      }
      expect(validatePermissionSchema.mock.calls.length).toBe(2);
      expect(validatePermissionSchema.mock.calls[1][0]).toEqual(fakeData);

      validatePermissionSchema.mockReturnValue([true])
    });

    it('should validatePrivateKey be called with correct parameters if signPermission is called', () => {
      const fakeData = {
        transfer_id,
        permission_status
      }
      signPermission(fakeData, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signPermission(fakeData, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => { throw new Error('error from validatePrivateKey'); });
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
        transfer_id
      };
      let sortedData = sortPermissionData(fakeData);
      signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(JSON.stringify(sortPermissionData(fakeData)));
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);

      fakeData.expire_date = 123;
      sortedData = sortPermissionData(fakeData);
      signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(2);
      expect(JSON.stringify(crypto.signObject.mock.calls[1][0])).toBe(JSON.stringify(sortPermissionData(fakeData)));
      expect(crypto.signObject.mock.calls[1][1]).toEqual(FAKE_PRIVATE_KEY);

      fakeData.permission_status = REJECTED;
      fakeData.reject_code = RejectCode.BVRC001;
      sortedData = sortPermissionData(fakeData);
      signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(3);
      expect(JSON.stringify(crypto.signObject.mock.calls[2][0])).toBe(JSON.stringify(sortPermissionData(fakeData)));
      expect(crypto.signObject.mock.calls[2][1]).toEqual(FAKE_PRIVATE_KEY);

      fakeData.reject_message = 'test';
      sortedData = sortPermissionData(fakeData);
      signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(4);
      expect(JSON.stringify(crypto.signObject.mock.calls[3][0])).toBe(JSON.stringify(sortPermissionData(fakeData)));
      expect(crypto.signObject.mock.calls[3][1]).toEqual(FAKE_PRIVATE_KEY);

    });
  });

  describe('test signPermission signature', () => {
    const transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const permission_status = ACCEPTED;
    const { signPermission, verifyObject } = crypto;

    it('should object which is return by signPermission be correct', () => {
      const fakeData = {
        permission_status,
        transfer_id
      }
      const sortedData = sortPermissionData(fakeData);
      const signature = signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(JSON.stringify(
        {
          ...sortedData,
          signature: "8500fde0806c6f8c94db848c4096cbc7deee3ee659b6dce3cb3accea8391c81122b46245801669b3da200e4311e8ef4012587be183bc00bed372204899a57595"
        }
      ));
      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      fakeData.expire_date = 2529024749000;
      const sortedData1 = sortPermissionData(fakeData);
      const signature1 = signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature1)).toBe(JSON.stringify(
        {
          ...sortedData1,
          signature: "8d4c251420af74105bd6ad270dc69e5bc763a850041dd26c2b7c7bade943ea892a9e9f06fb5e6c087a0013cbefd5c355fc04bac6d0e9ac25b60b3d3969f67be7"
        }
      ));
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);

      const fakeRejectedData = {
        permission_status: REJECTED,
        reject_code: RejectCode.BVRC001,
        transfer_id
      }
      const sortedData2 = sortPermissionData(fakeRejectedData);
      const signature2 = signPermission(fakeRejectedData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature2)).toBe(JSON.stringify(
        {
          ...sortedData2,
          signature: "d0aa0ef942207bfc2f478b72a654286ac8f99125c16c9969bb95da32aa374d0f235830398c2d35795f31d21958a9c3ee5eb6fd2f732efe363d2fd029e46b9243"
        }
      ));
      const isValid2 = verifyObject(signature2, FAKE_PUBLIC_KEY);
      expect(isValid2).toBe(true);

      fakeRejectedData.reject_message = 'unsupported_currency';
      const sortedData3 = sortPermissionData(fakeRejectedData);
      const signature3 = signPermission(fakeRejectedData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature3)).toBe(JSON.stringify(
        {
          ...sortedData3,
          signature: "6ce0f3dff883983fbd29cd3e41a8c1e76a33d9765de7c77c89c43f5fe9a500a31fe03b3efcfb39de9b2f41d5b3502b3b75eb88f87798a09b18259005385ed2d8"
        }
      ));
      const isValid3 = verifyObject(signature3, FAKE_PUBLIC_KEY);
      expect(isValid3).toBe(true);

      fakeRejectedData.expire_date = 2529024749000;
      const sortedData4 = sortPermissionData(fakeRejectedData);
      const signature4 = signPermission(fakeRejectedData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature4)).toBe(JSON.stringify(
        {
          ...sortedData4,
          signature: "f3ba132acb7d681b3b05ebb119d61fa86806b68cf1eab13cfe1db6a78314990e5de887932dcebe98798d3325fae7c48072b4229c391082c50ba45d8b3d64ddff"
        }
      ));
      const isValid4 = verifyObject(signature4, FAKE_PUBLIC_KEY);
      expect(isValid4).toBe(true);

    });
  });

  describe('test signCallBack', () => {
    const callback_url = 'http://google.com';

    const crypto = require('../src/crypto');
    crypto.signObject = jest.fn();

    const { signCallBack } = crypto;
    beforeEach(() => {
      validateCallbackSchema.mockClear();
      crypto.signObject.mockReset();
      validatePrivateKey.mockClear();
    });

    it('should validateCallbackSchema be called with correct parameters if signCallBack is called', () => {
      const fakeData = {
        callback_url
      }
      const fakeError = [
        {
          "keyword": "test",
          "dataPath": "",
          "schemaPath": "#/properties",
          "params": { "comparison": ">=" },
          "message": `error from validateCallbackSchema`
        }
      ]
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

      validateCallbackSchema.mockReturnValue([true])
    });

    it('should validatePrivateKey be called with correct parameters if signCallBack is called', () => {
      const fakeData = {
        callback_url
      }
      signCallBack(fakeData, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signCallBack(fakeData, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => { throw new Error('error from validatePrivateKey'); });
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
        callback_url
      };
      const sortedData = sortCallbackData(fakeData);
      signCallBack(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(JSON.stringify(sortedData));
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);
    });
  });

  describe('test signCallBack signature', () => {
    const callback_url = 'https://www.google.com.tw/';
    const callback_url1 = 'https://stackoverflow.com/';
    const { signCallBack, verifyObject } = crypto;
    it('should object which is return by signPermission be correct', () => {
      const fakeData = { callback_url };
      const sortedData = sortCallbackData(fakeData);
      const signature = signCallBack(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(JSON.stringify(
        {
          ...sortedData,
          signature: "70523f954126b49ba96abed9cf0a28d2093bb8a8c3f04961e0de644c64ba959520a483b178502946e24e5f9a2ba3269310a883699cf9f72f5d92af00cd8d69fa"
        }
      ));
      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      fakeData.callback_url = callback_url1;
      const sortedData1 = sortCallbackData(fakeData);
      const signature1 = signCallBack(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature1)).toBe(JSON.stringify(
        {
          ...sortedData1,
          signature: "36a5df2a18af5663f9ddc78e9895b5008fdc9b62c5a1a97adcd62e9ed96064420b3891f62d25391906710321419d3f8dd57edb4bd15e8520f029a074a1f1265c"
        }
      ));
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);
    });
  });

  describe('test signTxId', () => {
    const txid = '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe473d';
    const transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

    const crypto = require('../src/crypto');
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
        txid
      }
      const fakeError = [
        {
          "keyword": "test",
          "dataPath": "",
          "schemaPath": "#/properties",
          "params": { "comparison": ">=" },
          "message": `error from validateTxIdSchema`
        }
      ]
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

      validateTxIdSchema.mockReturnValue([true])
    });

    it('should validatePrivateKey be called with correct parameters if signTxId is called', () => {
      const fakeData = {
        transfer_id,
        txid
      }
      signTxId(fakeData, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signTxId(fakeData, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => { throw new Error('error from validatePrivateKey'); });
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
        transfer_id
      };
      const sortedData = sortTxIdData(fakeData);
      signTxId(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(JSON.stringify(sortedData));
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);
    });
  });

  describe('test signTxId signature', () => {
    const txid = '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe473d';
    const transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

    const { signTxId, verifyObject } = crypto;
    it('should object which is return by signPermission be correct', () => {
      const fakeData = { txid, transfer_id };
      const sortedData = sortTxIdData(fakeData);
      const signature = signTxId(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(JSON.stringify(
        {
          ...sortedData,
          signature: "637b90ee3cf2fcb97fa155f7d99228ac41134ac01803575242b496166eac11ab4eb4d132829a2fda83ed9ee3d8b90c5360f752d8969b929344c73141ff03d318"
        }
      ));
      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      fakeData.txid = '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe375d';
      const sortedData1 = sortTxIdData(fakeData);
      const signature1 = signTxId(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature1)).toBe(JSON.stringify(
        {
          ...sortedData1,
          signature: "30326aab59c7cbd2a04fc957ff2d3baa91bf3e4279db35735e48321b8cf973bd52f2aa64f6304e38a4f2f4b87f6f4b81eec0aa2dea4f00b34e2beddc74e795f7"
        }
      ));
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);

    });
  });

});
