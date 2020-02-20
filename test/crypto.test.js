const { checkExpireDateValid } = require('../src/api/check');

jest.mock('../src/api/check', () => ({
  checkExpireDateValid: jest.fn()
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

    it('should checkExpireDateValid and signObject be called with correct parameters if signPermissionRequest was called', () => {
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
      expect(checkExpireDateValid).toBeCalledWith(123);
      expect(checkExpireDateValid.mock.calls.length).toBe(2);
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
      checkExpireDateValid.mockClear();
      crypto.signObject.mockClear();
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
            permission_status: "ACCEPT",
          },
          123
        );
      } catch (error) {
        expect(error).toEqual(new Error(`privateKey should be string, got number`))
      }

      try {
        signPermission({
          transfer_id: "123",
          permission_status: "ACCEPT"
        });
      } catch (error) {
        expect(error).toEqual(new Error(`privateKey should be string, got undefined`))
      }
    });

    it('should checkExpireDateValid and signObject be called once if signPermission was called', () => {
      const privateKey = "123";
      const data = {
        transfer_id: "123",
        permission_status: "ACCEPT",
      };
      signPermission(data, privateKey);
      expect(checkExpireDateValid).toBeCalledWith(undefined);
      expect(checkExpireDateValid.mock.calls.length).toBe(1);
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
      expect(checkExpireDateValid).toBeCalledWith(123);
      expect(checkExpireDateValid.mock.calls.length).toBe(2);
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
        permission_status: "ACCEPT"
      };

      const signature = signPermission(data, privateKey);
      expect(signature).toEqual(
        {
          transfer_id: data.transfer_id,
          permission_status: data.permission_status,
          signature: "a0f0e3a8c474494efa30cbbae7a104eb78ef3471dcae97d82df128b0d9c706813cae7a06c3b00cfddf95ef5bb2521c2410257f02e5d2af81087d17c39e4b5393"
        }
      )


      data.expire_date = 123;
      const signature1 = signPermission(data, privateKey);
      expect(signature1).toEqual(
        {
          transfer_id: data.transfer_id,
          permission_status: data.permission_status,
          expire_date: data.expire_date,
          signature: "e4c0282be79e424b96c7433b6c823bbbc99f4439b64e714d22e115696be6b69d79c93664718aa0a3596a042b076e469e803a07c30457bb3103d9f13b55352aaa"
        }
      )
    });
  });
});
