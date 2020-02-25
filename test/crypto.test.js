const {
  validatePermissionRequestSchema,
  validatePermissionSchema,
  validateCallbackSchema,
  validateTxIdSchema
} = require('../src/utils/validateSchema');

const {
  validatePrivateKey
} = require('../src/utils/validatePrivateKey')

const { ACCEPTED, REJECTED } = require('../src/config');

jest.mock('../src/utils/validateSchema', () => ({
  validatePermissionRequestSchema: jest.fn().mockReturnValue([true]),
  validatePermissionSchema: jest.fn().mockReturnValue([true]),
  validateCallbackSchema: jest.fn().mockReturnValue([true]),
  validateTxIdSchema: jest.fn().mockReturnValue([true])
}));

jest.mock('../src/utils/validatePrivateKey', () => ({
  validatePrivateKey: jest.fn()
}));


describe('test crypto', () => {
  let crypto;
  jest.isolateModules(() => {
    crypto = require('../src/crypto');
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
        data: {
          private_info: 123
        },
        callback: {
          callback_url: 'http://google.com'
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

      signPermissionRequest(fakeData);
      expect(validatePermissionRequestSchema.mock.calls.length).toBe(1);
      expect(validatePermissionRequestSchema.mock.calls[0][0]).toEqual(fakeData);

      try {
        signPermissionRequest(fakeData);
        fail('not throw error');
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
      signPermissionRequest({}, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signPermissionRequest({}, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => { throw new Error('error from validatePrivateKey'); });
      try {
        signPermissionRequest({}, 'def');
        fail('not throw error');
      } catch (error) {
        const { message } = error;
        expect(message).toEqual('error from validatePrivateKey');
      }
      validatePrivateKey.mockReset();
    });

    it('should signObject be called with correct parameters if signPermissionRequest is called', () => {
      const privateKey = "123";
      const data = {
        private_info: "private_info",
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: "123",
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          transaction_currency: '123',
          amount: 1
        },
        data_dt: '2019-07-29T06:29:00.123Z'
      };
      signPermissionRequest(data, privateKey);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(crypto.signObject.mock.calls[0][0]).toEqual(
        {
          private_info: data.private_info,
          data_dt: data.data_dt,
          transaction: data.transaction
        }
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(privateKey);

      data.expire_date = 123;
      signPermissionRequest(data, privateKey);
      expect(crypto.signObject.mock.calls.length).toBe(2);
      expect(crypto.signObject.mock.calls[1][0]).toEqual(
        {
          private_info: data.private_info,
          data_dt: data.data_dt,
          transaction: data.transaction,
          expire_date: data.expire_date
        }
      );
      expect(crypto.signObject.mock.calls[1][1]).toEqual(privateKey);
    });
  });

  describe('test signPermissionRequest signature', () => {
    const { signPermissionRequest } = crypto;

    it('should object which is return by signPermissionRequest be correct', () => {
      const privateKey = "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b";
      const data = {
        private_info: "private_info",
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: "123",
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          transaction_currency: '123',
          amount: 1
        },
        data_dt: '2019-07-29T06:29:00.123Z'
      }
      const signature = signPermissionRequest(data, privateKey);
      expect(signature).toEqual(
        {
          private_info: data.private_info,
          transaction: data.transaction,
          data_dt: data.data_dt,
          signature: "711f036525311d42dd9e741bf5ed42a713c5615cebd3b6bda628cd8fd901505803644d0c2702f153ee495efffa7fdd743749d21fcc76284e95135f9ad7023775"
        }
      )

      data.expire_date = 2529024749000;
      const signature1 = signPermissionRequest(data, privateKey);
      expect(signature1).toEqual(
        {
          private_info: data.private_info,
          transaction: data.transaction,
          data_dt: data.data_dt,
          expire_date: data.expire_date,
          signature: "69b1955e6e68d01095fce2287d7591ee9d3988e346666471cece909eceab86f2161777915f998b3ea5c794ffd9069611187d13034d06c62d491dcefd6faae2d5"
        }
      )
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
        transfer_id: '123',
        permission_status: ACCEPTED
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

      signPermission(fakeData);
      expect(validatePermissionSchema.mock.calls.length).toBe(1);
      expect(validatePermissionSchema.mock.calls[0][0]).toEqual(fakeData);

      try {
        signPermission(fakeData);
        fail('not throw error');
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
      signPermission({}, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signPermission({}, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => { throw new Error('error from validatePrivateKey'); });
      try {
        signPermission({}, 'def');
        fail('not throw error');
      } catch (error) {
        const { message } = error;
        expect(message).toEqual('error from validatePrivateKey');
      }
      validatePrivateKey.mockReset();
    });

    it('should signObject be called with correct parameters if signPermission is called', () => {
      const privateKey = "123";
      const data = {
        transfer_id,
        permission_status,
      };
      signPermission(data, privateKey);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(crypto.signObject.mock.calls[0][0]).toEqual(
        {
          transfer_id: data.transfer_id,
          permission_status: data.permission_status
        }
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(privateKey);

      data.expire_date = 123;
      signPermission(data, privateKey);
      expect(crypto.signObject.mock.calls.length).toBe(2);
      expect(crypto.signObject.mock.calls[1][0]).toEqual(
        {
          transfer_id: data.transfer_id,
          permission_status: data.permission_status,
          expire_date: data.expire_date
        }
      );
      expect(crypto.signObject.mock.calls[1][1]).toEqual(privateKey);
    });
  });

  describe('test signPermission signature', () => {
    const transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const permission_status = ACCEPTED;
    const { signPermission } = crypto;

    it('should object which is return by signPermission be correct', () => {
      const privateKey = "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b";
      const data = {
        transfer_id,
        permission_status,
        reject_code: "BVRC001",
        reject_message: "unsupported_currency"
      };

      const signature = signPermission(data, privateKey);
      expect(signature).toEqual(
        {
          transfer_id: data.transfer_id,
          permission_status: data.permission_status,
          signature: "634dc1ee1127a94235b3e581f883d6b9f96aefc1b6b800b3dca6fc50de46f58174ff75594f8e997de1dabf8092b39fe37cad3f943f4f25fe9633a02756d167f9"
        }
      )

      data.expire_date = 2529024749000;
      const signature1 = signPermission(data, privateKey);
      expect(signature1).toEqual(
        {
          transfer_id: data.transfer_id,
          permission_status: data.permission_status,
          expire_date: data.expire_date,
          signature: "1980c80d04863d04f483cae5be02f3a8feb15a568d3e42813dd1d40c5a4dd30c4b5019cc04882aab8068e4a4aa98397e7d40667884a6b70e599ebc2eedc73b55"
        }
      )

      data.permission_status = REJECTED;
      const signature2 = signPermission(data, privateKey);
      expect(signature2).toEqual(
        {
          transfer_id: data.transfer_id,
          permission_status: data.permission_status,
          expire_date: data.expire_date,
          reject_code: data.reject_code,
          reject_message: data.reject_message,
          signature: "11f9baa9a939ec0420ab5c4a4dcde7c6b88d4f345fcf6809ec88ae5ae51d0e4405e8832ee653a817f45e60977a835b45c6b236f527cfb2917e701f3ed22ad38a"
        }
      )
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

      signCallBack(fakeData);
      expect(validateCallbackSchema.mock.calls.length).toBe(1);
      expect(validateCallbackSchema.mock.calls[0][0]).toEqual(fakeData);

      try {
        signCallBack(fakeData);
        fail('not throw error');
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
      signCallBack({}, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signCallBack({}, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => { throw new Error('error from validatePrivateKey'); });
      try {
        signCallBack({}, 'def');
        fail('not throw error');
      } catch (error) {
        const { message } = error;
        expect(message).toEqual('error from validatePrivateKey');
      }
      validatePrivateKey.mockReset();
    });

    it('should signObject be called with correct parameters if signCallBack is called', () => {
      const privateKey = '123';
      const data = {
        callback_url
      };
      signCallBack(data, privateKey);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(crypto.signObject.mock.calls[0][0]).toEqual(
        {
          callback_url: data.callback_url
        }
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(privateKey);
    });
  });

  describe('test signCallBack signature', () => {
    const callback_url = 'https://www.google.com.tw/';
    const callback_url1 = 'https://stackoverflow.com/';
    const { signCallBack } = crypto;
    it('should object which is return by signPermission be correct', () => {
      const privateKey = "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b";
      const data = { callback_url };

      const signature = signCallBack(data, privateKey);
      expect(signature).toEqual(
        {
          callback_url: data.callback_url,
          signature: "019b9fb037826e24cd58031b0e58e86b5048657db08d094b475fea6f114ad28220d644d17b07badee58139e6d9b70a136be363155c5cdde8c9b865f877209505"
        }
      )

      data.callback_url = callback_url1;
      const signature1 = signCallBack(data, privateKey);
      expect(signature1).toEqual(
        {
          callback_url: data.callback_url,
          signature: "ecf9c1501db07a336efc34f54b556cd1a122d1ef4dec336ecbf3d8d1af029dad2f75a26b7cd29831412cdef30b9e4ea04cb1a2d36b551f3afdb5c6916dcd52c9"
        }
      )
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

      signTxId(fakeData);
      expect(validateTxIdSchema.mock.calls.length).toBe(1);
      expect(validateTxIdSchema.mock.calls[0][0]).toEqual(fakeData);

      try {
        signTxId(fakeData);
        fail('not throw error');
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
      signTxId({}, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signTxId({}, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => { throw new Error('error from validatePrivateKey'); });
      try {
        signTxId({}, 'def');
        fail('not throw error');
      } catch (error) {
        const { message } = error;
        expect(message).toEqual('error from validatePrivateKey');
      }
      validatePrivateKey.mockReset();
    });

    it('should signObject be called with correct parameters if signTxId is called', () => {
      const privateKey = '123';
      const data = {
        transfer_id,
        txid
      };
      signTxId(data, privateKey);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(crypto.signObject.mock.calls[0][0]).toEqual(
        {
          transfer_id,
          txid
        }
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(privateKey);
    });
  });

  describe('test signTxId signature', () => {
    const txid = '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe473d';
    const transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

    const { signTxId } = crypto;
    it('should object which is return by signPermission be correct', () => {
      const privateKey = "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b";
      const data = { txid, transfer_id };

      const signature = signTxId(data, privateKey);
      expect(signature).toEqual(
        {
          transfer_id: data.transfer_id,
          txid: data.txid,
          signature: "e3872164c17a35be953661b17d74b0a1aa5d94c899c6d66781635030bb2850ad285fd440d61a581fda1292c08b23537cd8891f985844514cdd1cdf1fd15a99f2"
        }
      )

      data.txid = '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe375d';
      const signature1 = signTxId(data, privateKey);
      expect(signature1).toEqual(
        {
          transfer_id: data.transfer_id,
          txid: data.txid,
          signature: "0859dd11bdacfbfdb7cfa6d05efb41e5e373a458f72ae0632a054b380788d3fb796688eed664bf8546b64b5e4f0247368dad2650201ca67542291279c3bf15eb"
        }
      )
    });
  });

});
