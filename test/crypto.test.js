const {
  signPermissionRequest,
  signPermission
} = require('../src/crypto');

const crypto = require('../src/crypto');
crypto.signObject = jest.fn();

const { checkExpireDateValid } = require('../src/api/check');

jest.mock('../src/api/check', () => ({
  checkExpireDateValid: jest.fn()
}));

describe('test crypto', () => {

  describe('test signPermissionRequest', () => {
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

    it('should throw error if private_key is not string', () => {
      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            private_key: 123
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`private_key should be string, got number`))
      }

      try {
        signPermissionRequest({
          private_info: "private_info",
          data_dt: "123",
        });
      } catch (error) {
        expect(error).toEqual(new Error(`private_key should be string, got undefined`))
      }
    });

    it('should throw error if transaction is not object', () => {
      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            private_key: "123",
            transaction: 123
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction should be object, got number`))
      }

      try {
        signPermissionRequest({
          private_info: "private_info",
          data_dt: "123",
          private_key: "{ a: 1 }"
        });
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
            private_key: "123",
            transaction: {
              beneficiary_addrs: 123
            }
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.beneficiary_addrs should be array, got number`))
      }

      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            private_key: "123",
            transaction: {
              a: 123
            }
          }
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
            private_key: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: 123
            }
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.originator_addrs should be array, got number`))
      }

      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            private_key: "123",
            transaction: {
              beneficiary_addrs: [123]
            }
          }
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
            private_key: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: 123
            }
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.originator_vasp_code should be string, got number`))
      }

      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            private_key: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123]
            }
          }
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
            private_key: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: "123",
              beneficiary_vasp_code: 123
            }
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.beneficiary_vasp_code should be string, got number`))
      }

      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            private_key: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: "123"
            }
          }
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
            private_key: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: "123",
              beneficiary_vasp_code: "123",
              transaction_currency: 123
            }
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.transaction_currency should be string, got number`))
      }

      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            private_key: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: "123",
              beneficiary_vasp_code: "123"
            }
          }
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
            private_key: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: "123",
              beneficiary_vasp_code: "123",
              transaction_currency: "123",
              amount: "123"
            }
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.amount should be number, got string`))
      }

      try {
        signPermissionRequest(
          {
            private_info: "private_info",
            data_dt: "123",
            private_key: "123",
            transaction: {
              beneficiary_addrs: [123],
              originator_addrs: [123],
              originator_vasp_code: "123",
              beneficiary_vasp_code: "123",
              transaction_currency: "123"
            }
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`transaction.amount should be number, got undefined`))
      }
    });

    it('should checkExpireDateValid is called once if signPermissionRequest is called', () => {
      signPermissionRequest(
        {
          private_info: "private_info",
          data_dt: "123",
          private_key: "123",
          transaction: {
            beneficiary_addrs: [123],
            originator_addrs: [123],
            originator_vasp_code: "123",
            beneficiary_vasp_code: "123",
            transaction_currency: "123",
            amount: 123
          }
        }
      );
      expect(checkExpireDateValid).toBeCalledWith(undefined);
      expect(checkExpireDateValid.mock.calls.length).toBe(1);
      expect(crypto.signObject.mock.calls.length).toBe(1);

      signPermissionRequest(
        {
          private_info: "private_info",
          data_dt: "123",
          private_key: "123",
          transaction: {
            beneficiary_addrs: [123],
            originator_addrs: [123],
            originator_vasp_code: "123",
            beneficiary_vasp_code: "123",
            transaction_currency: "123",
            amount: 123
          },
          expire_date: 123
        }
      );
      expect(checkExpireDateValid).toBeCalledWith(123);
      expect(checkExpireDateValid.mock.calls.length).toBe(2);
      expect(crypto.signObject.mock.calls.length).toBe(2);
    });
  });

  describe('test signPermission', () => {
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

    it('should throw error if private_key is not string', () => {
      try {
        signPermission(
          {
            transfer_id: "123",
            permission_status: "ACCEPT",
            private_key: 123
          }
        );
      } catch (error) {
        expect(error).toEqual(new Error(`private_key should be string, got number`))
      }

      try {
        signPermission({
          transfer_id: "123",
          permission_status: "ACCEPT"
        });
      } catch (error) {
        expect(error).toEqual(new Error(`private_key should be string, got undefined`))
      }
    });

    it('should checkExpireDateValid is called once if signPermission is called', () => {
      signPermission(
        {
          transfer_id: "123",
          permission_status: "ACCEPT",
          private_key: "123"
        }
      );
      expect(checkExpireDateValid).toBeCalledWith(undefined);
      expect(checkExpireDateValid.mock.calls.length).toBe(1);
      expect(crypto.signObject.mock.calls.length).toBe(1);

      signPermission(
        {
          transfer_id: "123",
          permission_status: "ACCEPT",
          private_key: "123",
          expire_date: 123
        }
      );
      expect(checkExpireDateValid).toBeCalledWith(123);
      expect(checkExpireDateValid.mock.calls.length).toBe(2);
      expect(crypto.signObject.mock.calls.length).toBe(2);
    });

  });

});
