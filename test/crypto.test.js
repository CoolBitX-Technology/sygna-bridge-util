const {
  checkExpireDateValid,
  checkPermissionStatus,
  checkRejectDataValid
} = require('../src/api/check');
const { ACCEPTED, REJECTED } = require('../src/config')

jest.mock('../src/api/check', () => ({
  checkExpireDateValid: jest.fn(),
  checkPermissionStatus: jest.fn(),
  checkRejectDataValid: jest.fn()
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
      checkExpireDateValid.mockClear();
      crypto.signObject.mockClear();
    });


    it('should throw error if private_info is not string', () => {
      try {
        signPermissionRequest(
          {
            private_info: 123
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`private_info should be string, got number`))
      }

      try {
        signPermissionRequest({});
      } catch (error) {
        expect(error).toEqual(new Error(`private_info should be string, got undefined`))
      }
    });

    it('should throw error if data_dt is not string', () => {
      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: 123
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`data_dt should be string, got number`))
      }

      try {
        signPermissionRequest({
          private_info: "private_info"
        });
      } catch (error) {
        expect(error).toEqual(new Error(`data_dt should be string, got undefined`))
      }
    });

    it('should throw error if privateKey is not string', () => {
      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
          },
          123
        );
      } catch (error) {
        expect(error).toEqual(new Error(`privateKey should be string, got number`))
      }

      try {
        signPermissionRequest({
          private_info: "private_info",
          data_dt: "123",
        });
      } catch (error) {
        expect(error).toEqual(new Error(`privateKey should be string, got undefined`))
      }
    });

    it('should throw error if transaction is not object', () => {
      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            transaction: 123
          },
          "123",
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction should be object, got number`))
      }

      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123"
          },
          "{ a: 1 }"
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction should be object, got undefined`))
      }
    });

    it('should throw error if transaction.beneficiary_addrs is not array', () => {
      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            transaction: {
              beneficiary_addrs: 123
            }
          },
          "123"
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.beneficiary_addrs should be array, got number`))
      }

      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            transaction: {
              a: 123
            }
          },
          "123"
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.beneficiary_addrs should be array, got undefined`))
      }
    });

    it('should throw error if transaction.originator_addrs is not array', () => {
      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: 123
            }
          },
          "123"
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.originator_addrs should be array, got number`))
      }

      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            transaction: {
              beneficiary_addrs: [123]
            }
          },
          "123"
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.originator_addrs should be array, got undefined`))
      }
    });

    it('should throw error if transaction.originator_vasp_code is not string', () => {
      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: 123
            }
          },
          "123"
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.originator_vasp_code should be string, got number`))
      }

      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123]
            }
          },
          "123"
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.originator_vasp_code should be string, got undefined`))
      }
    });

    it('should throw error if transaction.beneficiary_vasp_code is not string', () => {
      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: "123",
              beneficiary_vasp_code: 123
            }
          },
          "123"
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.beneficiary_vasp_code should be string, got number`))
      }

      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: "123"
            }
          },
          "123"
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.beneficiary_vasp_code should be string, got undefined`))
      }
    });

    it('should throw error if transaction.transaction_currency is not string', () => {
      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: "123",
              beneficiary_vasp_code: "123",
              transaction_currency: 123
            }
          },
          "123"
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.transaction_currency should be string, got number`))
      }

      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: "123",
              beneficiary_vasp_code: "123"
            }
          },
          "123"
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.transaction_currency should be string, got undefined`))
      }
    });


    it('should throw error if transaction.amount is not number', () => {
      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: "123",
              beneficiary_vasp_code: "123",
              transaction_currency: "123",
              amount: "123"
            }
          },
          "123"
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.amount should be number, got string`))
      }

      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: "123",
              beneficiary_vasp_code: "123",
              transaction_currency: "123"
            }
          },
          "123"
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.amount should be number, got undefined`))
      }
    });

    it('should checkExpireDateValid be called with correct parameters if signPermissionRequest was called', () => {
      const privateKey = "123";
      const data = {
        private_info: "private_info",
        data_dt: "123",
        transaction: {
          beneficiary_addrs: [123],
          originator_addrs: [123],
          originator_vasp_code: "123",
          beneficiary_vasp_code: "123",
          transaction_currency: "123",
          amount: 123
        }
      };
      signPermissionRequest(data, privateKey);
      expect(checkExpireDateValid).toBeCalledWith(undefined);
      expect(checkExpireDateValid.mock.calls.length).toBe(1);

      data.expire_date = 123;
      signPermissionRequest(data, privateKey);
      expect(checkExpireDateValid).toBeCalledWith(123);
      expect(checkExpireDateValid.mock.calls.length).toBe(2);

      try {
        checkExpireDateValid.mockImplementationOnce(() => {
          throw new Error('error from checkExpireDateValid');
        });
        signPermissionRequest(data, privateKey);
      } catch (error) {
        expect(error).toEqual(new Error(`error from checkExpireDateValid`))
      }
    });

    it('should signObject be called with correct parameters if signPermissionRequest was called', () => {
      const privateKey = "123";
      const data = {
        private_info: "private_info",
        data_dt: "123",
        transaction: {
          beneficiary_addrs: [123],
          originator_addrs: [123],
          originator_vasp_code: "123",
          beneficiary_vasp_code: "123",
          transaction_currency: "123",
          amount: 123
        }
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
    beforeEach(() => {
      checkExpireDateValid.mockClear();
    });

    it('should object which is return by signPermissionRequest be correct', () => {
      const privateKey = "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b";
      const data = {
        private_info: "private_info",
        data_dt: "123",
        transaction: {
          beneficiary_addrs: [123],
          originator_addrs: [123],
          originator_vasp_code: "123",
          beneficiary_vasp_code: "123",
          transaction_currency: "123",
          amount: 123
        }
      }
      const signature = signPermissionRequest(data, privateKey);
      expect(signature).toEqual(
        {
          private_info: data.private_info,
          transaction: data.transaction,
          data_dt: data.data_dt,
          signature: "932797f0fbe29d726a2ad7ea0b097ba46bbcbc632342f9344257652811f149a9121a5bc21880e653ad8b1ff1d55c9ffbe6c24a8107978a720884c3cf8db3437f"
        }
      )

      data.expire_date = 123;
      const signature1 = signPermissionRequest(data, privateKey);
      expect(signature1).toEqual(
        {
          private_info: data.private_info,
          transaction: data.transaction,
          data_dt: data.data_dt,
          expire_date: data.expire_date,
          signature: "4f548a64281660761d9b90dd679b2e7994ae661bafa50b65acefdf2774d7350f1de477ae23b7bb740a5be3c1427c7d1cee830464bf0f5bce37d69394cdaa045a"
        }
      )
    });
  });

  describe('test signPermission', () => {
    const crypto = require('../src/crypto');
    crypto.signObject = jest.fn();

    const { signPermission } = crypto;
    beforeEach(() => {
      checkExpireDateValid.mockReset();
      checkPermissionStatus.mockReset();
      checkRejectDataValid.mockReset();
      crypto.signObject.mockReset();
    });

    it('should throw error if transfer_id is not string', () => {
      try {
        signPermission(
          {
            transfer_id: 123
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transfer_id should be string, got number`))
      }

      try {
        signPermission({});
      } catch (error) {
        expect(error).toEqual(new Error(`transfer_id should be string, got undefined`))
      }
    });

    it('should throw error if permission_status is not string', () => {
      try {
        signPermission(
          {
            transfer_id: "123",
            permission_status: 123
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`permission_status should be string, got number`))
      }

      try {
        signPermission({
          transfer_id: "123"
        });
      } catch (error) {
        expect(error).toEqual(new Error(`permission_status should be string, got undefined`))
      }
    });

    it('should throw error if privateKey is not string', () => {
      try {
        signPermission(
          {
            transfer_id: "123",
            permission_status: ACCEPTED,
          },
          123
        );
      } catch (error) {
        expect(error).toEqual(new Error(`privateKey should be string, got number`))
      }

      try {
        signPermission({
          transfer_id: "123",
          permission_status: ACCEPTED
        });
      } catch (error) {
        expect(error).toEqual(new Error(`privateKey should be string, got undefined`))
      }
    });

    it('should checkPermissionStatus be called with correct parameters if signPermission was called', () => {
      const privateKey = "123";
      const data = {
        transfer_id: "123",
        permission_status: ACCEPTED,
      };

      signPermission(data, privateKey);
      expect(checkPermissionStatus).toBeCalledWith(ACCEPTED);
      expect(checkPermissionStatus.mock.calls.length).toBe(1);

      data.permission_status = REJECTED;
      signPermission(data, privateKey);
      expect(checkPermissionStatus).toBeCalledWith(REJECTED);
      expect(checkPermissionStatus.mock.calls.length).toBe(2);

      try {
        checkPermissionStatus.mockImplementationOnce(() => {
          throw new Error('error from checkPermissionStatus');
        });
        signPermission(data, privateKey);
      } catch (error) {
        expect(error).toEqual(new Error(`error from checkPermissionStatus`))
      }
    });

    it('should checkRejectDataValid be called with correct parameters if signPermission was called', () => {
      const privateKey = "123";
      const data = {
        transfer_id: "123",
        permission_status: REJECTED,
        reject_code: "456",
        reject_message: "789"
      };

      signPermission(data, privateKey);
      expect(checkRejectDataValid.mock.calls.length).toBe(1);
      expect(checkRejectDataValid.mock.calls[0][0]).toBe(data.permission_status);
      expect(checkRejectDataValid.mock.calls[0][1]).toBe(data.reject_code);
      expect(checkRejectDataValid.mock.calls[0][2]).toBe(data.reject_message);

      data.reject_code = "555";
      data.reject_message = "666";
      signPermission(data, privateKey);
      expect(checkRejectDataValid.mock.calls.length).toBe(2);
      expect(checkRejectDataValid.mock.calls[1][0]).toBe(data.permission_status);
      expect(checkRejectDataValid.mock.calls[1][1]).toBe(data.reject_code);
      expect(checkRejectDataValid.mock.calls[1][2]).toBe(data.reject_message);

      try {
        checkRejectDataValid.mockImplementationOnce(() => {
          throw new Error('error from checkRejectDataValid');
        });
        signPermission(data, privateKey);
      } catch (error) {
        expect(error).toEqual(new Error(`error from checkRejectDataValid`))
      }
    });

    it('should checkExpireDateValid be called with correct parameters if signPermission was called', () => {
      const privateKey = "123";
      const data = {
        transfer_id: "123",
        permission_status: ACCEPTED,
      };

      signPermission(data, privateKey);
      expect(checkExpireDateValid).toBeCalledWith(undefined);
      expect(checkExpireDateValid.mock.calls.length).toBe(1);

      data.expire_date = 123;
      signPermission(data, privateKey);
      expect(checkExpireDateValid).toBeCalledWith(123);
      expect(checkExpireDateValid.mock.calls.length).toBe(2);

      try {
        checkExpireDateValid.mockImplementationOnce(() => {
          throw new Error('error from checkExpireDateValid');
        });
        signPermission(data, privateKey);
      } catch (error) {
        expect(error).toEqual(new Error(`error from checkExpireDateValid`))
      }
    });

    it('should signObject be called with correct parameters if signPermission was called', () => {
      const privateKey = "123";
      const data = {
        transfer_id: "123",
        permission_status: ACCEPTED,
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
    const { signPermission } = crypto;
    beforeEach(() => {
      checkExpireDateValid.mockClear();
    });

    it('should object which is return by signPermission be correct', () => {
      const privateKey = "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b";
      const data = {
        transfer_id: "123",
        permission_status: ACCEPTED,
        reject_code: "456",
        reject_message: "transfer_id is not valid"
      };

      const signature = signPermission(data, privateKey);
      expect(signature).toEqual(
        {
          transfer_id: data.transfer_id,
          permission_status: data.permission_status,
          signature: "cc8643e0e18695f015d19b0ceb5859e281fc9043f18655a58670fb12108be7b044e308d523b41d20230197b659e583b80d61a0c112c14c80be7be8b89efa4e5d"
        }
      )

      data.expire_date = 123;
      const signature1 = signPermission(data, privateKey);
      expect(signature1).toEqual(
        {
          transfer_id: data.transfer_id,
          permission_status: data.permission_status,
          expire_date: data.expire_date,
          signature: "6b0af70a6ea3cb3d363e16852ae5124b58f2c4cdf398af9dc8043952ed4407e215f3a5caee84cd768236b0edd841cee77f5da1cb932080eec0767aa7c86cd461"
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
          signature: "d2160e0c8ba4931dac49a937581965c26a4ca34abf25b645f706b522f7187be04b03c0c3da732b0c692b6c911f94194e8ab918ae789de8677bd78f34fae37df5"
        }
      )

    });
  });
});
