const { ACCEPTED, REJECTED } = require('../src/config')

describe('test api', () => {
  const apiModule = require('../src/api');
  const domain = "http://google.com/";
  const api_key = "1234567890";
  describe('test postPermissionRequest', () => {
    const check = require('../src/api/check');
    check.checkExpireDateValid = jest.fn();
    const instance = new apiModule.API(api_key, domain);
    instance.postSB = jest.fn();

    beforeEach(() => {
      check.checkExpireDateValid.mockReset();
      instance.postSB.mockClear();
    });

    it('should throw error if signature is not valid in requestData', async () => {
      try {
        await instance.postPermissionRequest(
          {

          },
          {

          });
      } catch (error) {
        expect(error).toEqual(new Error(`Missing signature in Object`))
      }
      try {
        await instance.postPermissionRequest(
          {
            signature: 123
          },
          {

          });
      } catch (error) {
        expect(error).toEqual(new Error(`Expect signature to be string, got number`))
      }
      try {
        await instance.postPermissionRequest(
          {
            signature: "123"
          },
          {

          });
      } catch (error) {
        expect(error).toEqual(new Error(`Expect signature length to be 128.`))
      }
    });

    it('should throw error if signature is not valid in callback', async () => {
      try {
        await instance.postPermissionRequest(
          {
            signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7"
          },
          {

          });
      } catch (error) {
        expect(error).toEqual(new Error(`Missing signature in Object`))
      }
      try {
        await instance.postPermissionRequest(
          {
            signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7"
          },
          {
            signature: 123
          });
      } catch (error) {
        expect(error).toEqual(new Error(`Expect signature to be string, got number`))
      }
      try {
        await instance.postPermissionRequest(
          {
            signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7"
          },
          {
            signature: "123"
          });
      } catch (error) {
        expect(error).toEqual(new Error(`Expect signature length to be 128.`))
      }
    });

    it('should checkExpireDateValid be called with correct parameters if postPermissionRequest was called', async () => {
      await instance.postPermissionRequest(
        {
          signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7"
        },
        {
          signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7"
        });
      expect(check.checkExpireDateValid).toBeCalledWith(undefined);
      expect(check.checkExpireDateValid.mock.calls.length).toBe(1);

      await instance.postPermissionRequest(
        {
          signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7",
          expire_date: 123
        },
        {
          signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7"
        });
      expect(check.checkExpireDateValid).toBeCalledWith(123);
      expect(check.checkExpireDateValid.mock.calls.length).toBe(2);

      try {
        check.checkExpireDateValid.mockImplementationOnce(() => {
          throw new Error('error from check.checkExpireDateValid');
        });
        await instance.postPermissionRequest(
          {
            signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7",
            expire_date: 123
          },
          {
            signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7"
          });
      } catch (error) {
        expect(error).toEqual(new Error(`error from check.checkExpireDateValid`))
      }
    });

    it('should postSB be called with correct parameters if postPermissionRequest was called', async () => {
      const requestData = {
        signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7",
        expire_date: 123
      }
      const callback = {
        signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7"
      }
      await instance.postPermissionRequest(requestData, callback);

      expect(instance.postSB.mock.calls[0][0]).toBe(`${domain}api/v1/bridge/transaction/permission-request`);
      expect(instance.postSB.mock.calls[0][1]).toEqual({
        data: requestData,
        callback
      });
      expect(instance.postSB.mock.calls.length).toBe(1);

    });
  });

  describe('test postPermission', () => {
    const check = require('../src/api/check');
    check.checkExpireDateValid = jest.fn();
    check.checkPermissionStatus = jest.fn();
    check.checkRejectDataValid = jest.fn();
    const instance = new apiModule.API(api_key, domain);
    instance.postSB = jest.fn();

    beforeEach(() => {
      check.checkExpireDateValid.mockReset();
      check.checkPermissionStatus.mockReset();
      check.checkRejectDataValid.mockReset();
      instance.postSB.mockClear();
    });

    it('should throw error if signature is not valid in permissionObj', async () => {
      try {
        await instance.postPermission(
          {

          });
      } catch (error) {
        expect(error).toEqual(new Error(`Missing signature in Object`))
      }
      try {
        await instance.postPermission(
          {
            signature: 123
          });
      } catch (error) {
        expect(error).toEqual(new Error(`Expect signature to be string, got number`))
      }
      try {
        await instance.postPermission(
          {
            signature: "123"
          });
      } catch (error) {
        expect(error).toEqual(new Error(`Expect signature length to be 128.`))
      }
    });

    it('should checkPermissionStatus be called with correct parameters if postPermission is called', async () => {
      const data = {
        signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7",
        permission_status: ACCEPTED
      };
      await instance.postPermission(data);
      expect(check.checkPermissionStatus).toBeCalledWith(data.permission_status);
      expect(check.checkPermissionStatus.mock.calls.length).toBe(1);

      data.permission_status = REJECTED;
      await instance.postPermission(data);
      expect(check.checkPermissionStatus).toBeCalledWith(data.permission_status);
      expect(check.checkPermissionStatus.mock.calls.length).toBe(2);

      try {
        check.checkPermissionStatus.mockImplementationOnce(() => {
          throw new Error('error from check.checkPermissionStatus');
        });
        await instance.postPermission(
          {
            signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7",
            permission_status: REJECTED,
            expire_date: 123
          });
      } catch (error) {
        expect(error).toEqual(new Error(`error from check.checkPermissionStatus`))
      }
    });

    it('should checkRejectDataValid be called with correct parameters if postPermission is called', async () => {
      const data = {
        signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7",
        permission_status: ACCEPTED,
        reject_code: "123",
        reject_message: "456"
      };
      await instance.postPermission(data);
      expect(check.checkRejectDataValid.mock.calls.length).toBe(1);
      expect(check.checkRejectDataValid.mock.calls[0][0]).toBe(data.permission_status);
      expect(check.checkRejectDataValid.mock.calls[0][1]).toBe(data.reject_code);
      expect(check.checkRejectDataValid.mock.calls[0][2]).toBe(data.reject_message);


      data.permission_status = REJECTED;
      data.reject_code = "321";
      data.reject_message = "654";
      await instance.postPermission(data);
      expect(check.checkRejectDataValid.mock.calls[1][0]).toBe(data.permission_status);
      expect(check.checkRejectDataValid.mock.calls[1][1]).toBe(data.reject_code);
      expect(check.checkRejectDataValid.mock.calls[1][2]).toBe(data.reject_message);

      try {
        check.checkRejectDataValid.mockImplementationOnce(() => {
          throw new Error('error from check.checkRejectDataValid');
        });
        await instance.postPermission(data);
      } catch (error) {
        expect(error).toEqual(new Error(`error from check.checkRejectDataValid`))
      }
    });

    it('should checkExpireDateValid be called with correct parameters if postPermission is called', async () => {
      const data = {
        signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7"
      };
      await instance.postPermission(data);
      expect(check.checkExpireDateValid).toBeCalledWith(undefined);
      expect(check.checkExpireDateValid.mock.calls.length).toBe(1);

      data.expire_date = 123;
      await instance.postPermission(data);
      expect(check.checkExpireDateValid).toBeCalledWith(123);
      expect(check.checkExpireDateValid.mock.calls.length).toBe(2);

      try {
        check.checkExpireDateValid.mockImplementationOnce(() => {
          throw new Error('error from check.checkExpireDateValid');
        });
        await instance.postPermission(data);
      } catch (error) {
        expect(error).toEqual(new Error(`error from check.checkExpireDateValid`))
      }
    });

    it('should postSB be called with correct parameters if postPermission is called', async () => {
      const permissionObj = {
        signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7",
        expire_date: 123
      }
      await instance.postPermission(permissionObj);

      expect(instance.postSB.mock.calls[0][0]).toBe(`${domain}api/v1/bridge/transaction/permission`);
      expect(instance.postSB.mock.calls[0][1]).toEqual(permissionObj);
      expect(instance.postSB.mock.calls.length).toBe(1);

    });
  });

});
