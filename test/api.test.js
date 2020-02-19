

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
      check.checkExpireDateValid.mockClear();
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

    it('should checkExpireDateValid is called with correct parameters if postPermissionRequest is called', async () => {
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
    });

    it('should postSB is called with correct parameters if postPermissionRequest is called', async () => {
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
    const instance = new apiModule.API(api_key, domain);
    instance.postSB = jest.fn();

    beforeEach(() => {
      check.checkExpireDateValid.mockClear();
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


    it('should checkExpireDateValid is called with correct parameters if postPermission is called', async () => {
      await instance.postPermission(
        {
          signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7"
        });
      expect(check.checkExpireDateValid).toBeCalledWith(undefined);
      expect(check.checkExpireDateValid.mock.calls.length).toBe(1);

      await instance.postPermission(
        {
          signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7",
          expire_date: 123
        });
      expect(check.checkExpireDateValid).toBeCalledWith(123);
      expect(check.checkExpireDateValid.mock.calls.length).toBe(2);
    });

    it('should postSB is called with correct parameters if postPermission is called', async () => {
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
