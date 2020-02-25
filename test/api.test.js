const { ACCEPTED, REJECTED } = require('../src/config')
const {
  validatePostPermissionRequestSchema,
  validatePostPermissionSchema,
  validateGetTransferStatusSchema,
  validatePostTxIdSchema
} = require('../src/utils/validateSchema');


jest.mock('../src/utils/validateSchema', () => ({
  validatePostPermissionRequestSchema: jest.fn().mockReturnValue([true]),
  validatePostPermissionSchema: jest.fn().mockReturnValue([true]),
  validateGetTransferStatusSchema: jest.fn().mockReturnValue([true]),
  validatePostTxIdSchema: jest.fn().mockReturnValue([true])
}));


describe('test api', () => {
  const apiModule = require('../src/api');
  const domain = "http://google.com/";
  const api_key = "1234567890";
  describe('test postPermissionRequest', () => {
    const fakeData = {
      data: {
        signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7",
        expire_date: 123
      },
      callback: {
        callback_url: 'http://google.com/',
        signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7"
      }
    }

    const instance = new apiModule.API(api_key, domain);
    instance.postSB = jest.fn();

    beforeEach(() => {
      validatePostPermissionRequestSchema.mockClear();
      instance.postSB.mockClear();
    });

    it('should validatePostPermissionRequestSchema be called with correct parameters if postPermissionRequest is called', async () => {
      const fakeError = [
        {
          "keyword": "test",
          "dataPath": "",
          "schemaPath": "#/properties",
          "params": { "comparison": ">=" },
          "message": `error from validatePostPermissionRequestSchema`
        }
      ]
      validatePostPermissionRequestSchema.mockReset();

      validatePostPermissionRequestSchema
        .mockReturnValueOnce([true])
        .mockReturnValue([false, fakeError]);

      await instance.postPermissionRequest(fakeData);
      expect(validatePostPermissionRequestSchema.mock.calls.length).toBe(1);
      expect(validatePostPermissionRequestSchema.mock.calls[0][0]).toEqual(fakeData);


      try {
        await instance.postPermissionRequest(fakeData);
        fail('not throw error');
      } catch (error) {
        const { keyword, message } = error[0];
        expect(keyword).toEqual('test');
        expect(message).toEqual('error from validatePostPermissionRequestSchema');
      }
      expect(validatePostPermissionRequestSchema.mock.calls.length).toBe(2);
      expect(validatePostPermissionRequestSchema.mock.calls[1][0]).toEqual(fakeData);

      validatePostPermissionRequestSchema.mockReturnValue([true]);
    });

    it('should postSB be called with correct parameters if postPermissionRequest is called', async () => {
      await instance.postPermissionRequest(fakeData);
      expect(instance.postSB.mock.calls[0][0]).toBe(`${domain}api/v1/bridge/transaction/permission-request`);
      expect(instance.postSB.mock.calls[0][1]).toEqual({
        data: fakeData.data,
        callback: fakeData.callback
      });
      expect(instance.postSB.mock.calls.length).toBe(1);
    });

  });

  describe('test postPermission', () => {
    const fakeData = {
      transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      permission_status: ACCEPTED,
      expire_date: 2529024749000
    }

    const instance = new apiModule.API(api_key, domain);
    instance.postSB = jest.fn();

    beforeEach(() => {
      validatePostPermissionSchema.mockClear();
      instance.postSB.mockClear();
    });

    it('should validatePostPermissionSchema be called with correct parameters if postPermissionRequest is called', async () => {
      const fakeError = [
        {
          "keyword": "test",
          "dataPath": "",
          "schemaPath": "#/properties",
          "params": { "comparison": ">=" },
          "message": `error from validatePostPermissionSchema`
        }
      ]
      validatePostPermissionSchema.mockReset();

      validatePostPermissionSchema
        .mockReturnValueOnce([true])
        .mockReturnValue([false, fakeError]);

      await instance.postPermission(fakeData);
      expect(validatePostPermissionSchema.mock.calls.length).toBe(1);
      expect(validatePostPermissionSchema.mock.calls[0][0]).toEqual(fakeData);


      try {
        await instance.postPermission(fakeData);
        fail('not throw error');
      } catch (error) {
        const { keyword, message } = error[0];
        expect(keyword).toEqual('test');
        expect(message).toEqual('error from validatePostPermissionSchema');
      }
      expect(validatePostPermissionSchema.mock.calls.length).toBe(2);
      expect(validatePostPermissionSchema.mock.calls[1][0]).toEqual(fakeData);

      validatePostPermissionSchema.mockReturnValue([true]);
    });

    it('should postSB be called with correct parameters if postPermission is called', async () => {
      await instance.postPermission(fakeData);

      expect(instance.postSB.mock.calls[0][0]).toBe(`${domain}api/v1/bridge/transaction/permission`);
      expect(instance.postSB.mock.calls[0][1]).toEqual(fakeData);
      expect(instance.postSB.mock.calls.length).toBe(1);

    });
  });

  describe('test getStatus', () => {
    const transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'

    const instance = new apiModule.API(api_key, domain);
    instance.getSB = jest.fn();

    beforeEach(() => {
      validateGetTransferStatusSchema.mockClear();
      instance.getSB.mockClear();
    });

    it('should validateGetTransferStatusSchema be called with correct parameters if getStatus is called', async () => {
      const fakeError = [
        {
          "keyword": "test",
          "dataPath": "",
          "schemaPath": "#/properties",
          "params": { "comparison": ">=" },
          "message": `error from validateGetTransferStatusSchema`
        }
      ]
      validateGetTransferStatusSchema.mockReset();

      validateGetTransferStatusSchema
        .mockReturnValueOnce([true])
        .mockReturnValue([false, fakeError]);

      await instance.getStatus(transfer_id);
      expect(validateGetTransferStatusSchema.mock.calls.length).toBe(1);
      expect(validateGetTransferStatusSchema.mock.calls[0][0]).toEqual({ transfer_id });


      try {
        await instance.getStatus(transfer_id);
        fail('not throw error');
      } catch (error) {
        const { keyword, message } = error[0];
        expect(keyword).toEqual('test');
        expect(message).toEqual('error from validateGetTransferStatusSchema');
      }
      expect(validateGetTransferStatusSchema.mock.calls.length).toBe(2);
      expect(validateGetTransferStatusSchema.mock.calls[1][0]).toEqual({ transfer_id });

      validateGetTransferStatusSchema.mockReturnValue([true]);
    });


    it('should getSB be called with correct parameters if getStatus is called', async () => {
      await instance.getStatus(transfer_id);

      expect(instance.getSB.mock.calls[0][0]).toBe(`${domain}api/v1/bridge/transaction/status?transfer_id=${transfer_id}`);
      expect(instance.getSB.mock.calls.length).toBe(1);

    });
  });

  describe('test postTransactionId', () => {
    const transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
    const txid = '9d5f8e21aa87dd5e787b766990f74cf3a961b4e439a56670b07569c846fe375d';
    const fakeData = {
      transfer_id,
      txid
    }
    const instance = new apiModule.API(api_key, domain);
    instance.postSB = jest.fn();

    beforeEach(() => {
      validatePostTxIdSchema.mockClear();
      instance.postSB.mockClear();
    });

    it('should validatePostTxIdSchema be called with correct parameters if postTransactionId is called', async () => {
      const fakeError = [
        {
          "keyword": "test",
          "dataPath": "",
          "schemaPath": "#/properties",
          "params": { "comparison": ">=" },
          "message": `error from validatePostTxIdSchema`
        }
      ]
      validatePostTxIdSchema.mockReset();

      validatePostTxIdSchema
        .mockReturnValueOnce([true])
        .mockReturnValue([false, fakeError]);

      await instance.postTransactionId(fakeData);
      expect(validatePostTxIdSchema.mock.calls.length).toBe(1);
      expect(validatePostTxIdSchema.mock.calls[0][0]).toEqual(fakeData);


      try {
        await instance.postTransactionId(fakeData);
        fail('not throw error');
      } catch (error) {
        const { keyword, message } = error[0];
        expect(keyword).toEqual('test');
        expect(message).toEqual('error from validatePostTxIdSchema');
      }
      expect(validatePostTxIdSchema.mock.calls.length).toBe(2);
      expect(validatePostTxIdSchema.mock.calls[1][0]).toEqual(fakeData);

      validatePostTxIdSchema.mockReturnValue([true]);
    });

    it('should postSB be called with correct parameters if postPermission is called', async () => {
      await instance.postTransactionId(fakeData);

      expect(instance.postSB.mock.calls[0][0]).toBe(`${domain}api/v1/bridge/transaction/txid`);
      expect(instance.postSB.mock.calls[0][1]).toEqual(fakeData);
      expect(instance.postSB.mock.calls.length).toBe(1);

    });

  });
});
