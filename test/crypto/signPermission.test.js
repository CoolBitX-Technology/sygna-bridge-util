const { FAKE_PRIVATE_KEY, FAKE_PUBLIC_KEY } = require('../fakeKeys');

const { ACCEPTED, REJECTED, RejectCode } = require('../../src/config');

const {
  validatePermissionSchema,
  validatePrivateKey,
  sortPermissionData,
} = require('../../src/utils');

jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  validatePermissionSchema: jest.fn().mockReturnValue([true]),
  validatePrivateKey: jest.fn(),
}));

describe('test signPermission', () => {
  let crypto;
  jest.isolateModules(() => {
    crypto = require('../../src/crypto');
  });

  describe('test mock', () => {
    const transfer_id =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const permission_status = ACCEPTED;

    const crypto = require('../../src/crypto');
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
        permission_status,
      };
      const fakeError = [
        {
          keyword: 'test',
          dataPath: '',
          schemaPath: '#/properties',
          params: { comparison: '>=' },
          message: `error from validatePermissionSchema`,
        },
      ];
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

      validatePermissionSchema.mockReturnValue([true]);
    });

    it('should validatePrivateKey be called with correct parameters if signPermission is called', () => {
      const fakeData = {
        transfer_id,
        permission_status,
      };
      signPermission(fakeData, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signPermission(fakeData, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => {
        throw new Error('error from validatePrivateKey');
      });
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
        transfer_id,
      };
      let sortedData = sortPermissionData(fakeData);
      signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(
        JSON.stringify(sortPermissionData(fakeData)),
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);

      fakeData.expire_date = 123;
      sortedData = sortPermissionData(fakeData);
      signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(2);
      expect(JSON.stringify(crypto.signObject.mock.calls[1][0])).toBe(
        JSON.stringify(sortPermissionData(fakeData)),
      );
      expect(crypto.signObject.mock.calls[1][1]).toEqual(FAKE_PRIVATE_KEY);

      fakeData.permission_status = REJECTED;
      fakeData.reject_code = RejectCode.BVRC001;
      sortedData = sortPermissionData(fakeData);
      signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(3);
      expect(JSON.stringify(crypto.signObject.mock.calls[2][0])).toBe(
        JSON.stringify(sortPermissionData(fakeData)),
      );
      expect(crypto.signObject.mock.calls[2][1]).toEqual(FAKE_PRIVATE_KEY);

      fakeData.reject_message = 'test';
      sortedData = sortPermissionData(fakeData);
      signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(4);
      expect(JSON.stringify(crypto.signObject.mock.calls[3][0])).toBe(
        JSON.stringify(sortPermissionData(fakeData)),
      );
      expect(crypto.signObject.mock.calls[3][1]).toEqual(FAKE_PRIVATE_KEY);
    });
  });

  describe('test signature', () => {
    const transfer_id =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const permission_status = ACCEPTED;
    const { signPermission, verifyObject } = crypto;

    it('should object which is return by signPermission be correct', () => {
      const fakeData = {
        permission_status,
        transfer_id,
      };
      const sortedData = sortPermissionData(fakeData);
      const signature = signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...sortedData,
          signature:
            '8500fde0806c6f8c94db848c4096cbc7deee3ee659b6dce3cb3accea8391c81122b46245801669b3da200e4311e8ef4012587be183bc00bed372204899a57595',
        }),
      );
      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      fakeData.expire_date = 2529024749000;
      const sortedData1 = sortPermissionData(fakeData);
      const signature1 = signPermission(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature1)).toBe(
        JSON.stringify({
          ...sortedData1,
          signature:
            '8d4c251420af74105bd6ad270dc69e5bc763a850041dd26c2b7c7bade943ea892a9e9f06fb5e6c087a0013cbefd5c355fc04bac6d0e9ac25b60b3d3969f67be7',
        }),
      );
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);

      const fakeRejectedData = {
        permission_status: REJECTED,
        reject_code: RejectCode.BVRC001,
        transfer_id,
      };
      const sortedData2 = sortPermissionData(fakeRejectedData);
      const signature2 = signPermission(fakeRejectedData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature2)).toBe(
        JSON.stringify({
          ...sortedData2,
          signature:
            'd0aa0ef942207bfc2f478b72a654286ac8f99125c16c9969bb95da32aa374d0f235830398c2d35795f31d21958a9c3ee5eb6fd2f732efe363d2fd029e46b9243',
        }),
      );
      const isValid2 = verifyObject(signature2, FAKE_PUBLIC_KEY);
      expect(isValid2).toBe(true);

      fakeRejectedData.reject_message = 'unsupported_currency';
      const sortedData3 = sortPermissionData(fakeRejectedData);
      const signature3 = signPermission(fakeRejectedData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature3)).toBe(
        JSON.stringify({
          ...sortedData3,
          signature:
            '6ce0f3dff883983fbd29cd3e41a8c1e76a33d9765de7c77c89c43f5fe9a500a31fe03b3efcfb39de9b2f41d5b3502b3b75eb88f87798a09b18259005385ed2d8',
        }),
      );
      const isValid3 = verifyObject(signature3, FAKE_PUBLIC_KEY);
      expect(isValid3).toBe(true);

      fakeRejectedData.expire_date = 2529024749000;
      const sortedData4 = sortPermissionData(fakeRejectedData);
      const signature4 = signPermission(fakeRejectedData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature4)).toBe(
        JSON.stringify({
          ...sortedData4,
          signature:
            'f3ba132acb7d681b3b05ebb119d61fa86806b68cf1eab13cfe1db6a78314990e5de887932dcebe98798d3325fae7c48072b4229c391082c50ba45d8b3d64ddff',
        }),
      );
      const isValid4 = verifyObject(signature4, FAKE_PUBLIC_KEY);
      expect(isValid4).toBe(true);
    });
  });
});
