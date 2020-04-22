const { FAKE_PRIVATE_KEY, FAKE_PUBLIC_KEY } = require('../fakeKeys');

const {
  validatePermissionRequestSchema,
  validatePrivateKey,
  sortPermissionRequestData,
} = require('../../src/utils');

jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  validatePermissionRequestSchema: jest.fn().mockReturnValue([true]),
  validatePrivateKey: jest.fn(),
}));

describe('test signPermissionRequest', () => {
  let crypto;
  jest.isolateModules(() => {
    crypto = require('../../src/crypto');
  });
  describe('test mock', () => {
    const crypto = require('../../src/crypto');
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
        private_info:
          '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        signature: '1234567890',
        transaction: {
          transaction_currency: '0x80000000',
          originator_addrs: ['16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'],
          originator_vasp_code: 'VASPTWTP1',
          beneficiary_addrs: ['3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'],
          amount: '1.0',
          beneficiary_vasp_code: 'VASPTWTP2',
        },
      };
      const fakeError = [
        {
          keyword: 'test',
          dataPath: '',
          schemaPath: '#/properties',
          params: { comparison: '>=' },
          message: `error from validatePermissionRequestSchema`,
        },
      ];
      validatePermissionRequestSchema.mockReset();

      validatePermissionRequestSchema
        .mockReturnValueOnce([true])
        .mockReturnValue([false, fakeError]);

      signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      expect(validatePermissionRequestSchema.mock.calls.length).toBe(1);
      expect(validatePermissionRequestSchema.mock.calls[0][0]).toEqual(
        fakeData,
      );

      try {
        signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
        fail('expected error was not occurred');
      } catch (error) {
        const { keyword, message } = error[0];
        expect(keyword).toEqual('test');
        expect(message).toEqual('error from validatePermissionRequestSchema');
      }
      expect(validatePermissionRequestSchema.mock.calls.length).toBe(2);
      expect(validatePermissionRequestSchema.mock.calls[1][0]).toEqual(
        fakeData,
      );

      validatePermissionRequestSchema.mockReturnValue([true]);
    });

    it('should validatePrivateKey be called with correct parameters if signPermissionRequest is called', () => {
      const fakeData = {
        data_dt: '2019-07-29T06:29:00.123Z',
        private_info:
          '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        signature: '1234567890',
        transaction: {
          transaction_currency: '0x80000000',
          originator_addrs: ['16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'],
          originator_vasp_code: 'VASPTWTP1',
          beneficiary_addrs: ['3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'],
          amount: '1.0',
          beneficiary_vasp_code: 'VASPTWTP2',
        },
      };

      signPermissionRequest(fakeData, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signPermissionRequest(fakeData, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => {
        throw new Error('error from validatePrivateKey');
      });
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
        private_info:
          '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        signature: '1234567890',
        transaction: {
          transaction_currency: '0x80000000',
          originator_addrs: ['16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'],
          originator_vasp_code: 'VASPTWTP1',
          beneficiary_addrs: ['3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'],
          amount: '1',
          beneficiary_vasp_code: 'VASPTWTP2',
        },
      };
      signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(
        JSON.stringify(sortPermissionRequestData(fakeData)),
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);

      fakeData.expire_date = 123;
      signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(2);
      expect(JSON.stringify(crypto.signObject.mock.calls[1][0])).toBe(
        JSON.stringify(sortPermissionRequestData(fakeData)),
      );
      expect(crypto.signObject.mock.calls[1][1]).toEqual(FAKE_PRIVATE_KEY);
    });
  });

  describe('test signature', () => {
    const { signPermissionRequest, verifyObject } = crypto;

    it('should object which is return by signPermissionRequest be correct', () => {
      const fakeData = {
        data_dt: '2019-07-29T06:29:00.123Z',
        private_info:
          '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        transaction: {
          transaction_currency: '0x80000000',
          originator_addrs: ['16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'],
          originator_vasp_code: 'VASPTWTP1',
          beneficiary_addrs: ['3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'],
          amount: '1.0',
          beneficiary_vasp_code: 'VASPTWTP2',
        },
      };
      const signature = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      const sortedFakeData = sortPermissionRequestData(fakeData);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...sortedFakeData,
          signature:
            '2602414daa89a80aee10a922f9c7dc22b8abe45922cc6a30c78a06ec4ee365c9501b4c884518cfb9e8aba09633520298848d7a6ff2d1f494f618c4f7beb0f7df',
        }),
      );

      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      fakeData.expire_date = 2529024749000;
      const signature1 = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      const sortedFakeData1 = sortPermissionRequestData(fakeData);
      expect(JSON.stringify(signature1)).toBe(
        JSON.stringify({
          ...sortedFakeData1,
          signature:
            '6c0bf58d98963507564deba9b98724dae59c03b78456cbb5fdbfb1f1b900b4e750ed811a306ab84aa16781c9ab2bb3cc354a98451d6336ef13ccf7bae52b7093',
        }),
      );
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);

      fakeData.transaction.originator_addrs_extra = { DT: '001' };
      const signature2 = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      const sortedFakeData2 = sortPermissionRequestData(fakeData);
      expect(JSON.stringify(signature2)).toBe(
        JSON.stringify({
          ...sortedFakeData2,
          signature:
            'd2d5c94b0e121ce97c5f94869c8032fad18e5fc1b6112844dd0f6ec2594fbc756cf1738ef498337b32789d744d2f5a5ea571d2d97938ae496b2e708c70f361ae',
        }),
      );
      const isValid2 = verifyObject(signature2, FAKE_PUBLIC_KEY);
      expect(isValid2).toBe(true);

      fakeData.transaction.beneficiary_addrs_extra = { DT: '002' };
      const signature3 = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      const sortedFakeData3 = sortPermissionRequestData(fakeData);
      expect(JSON.stringify(signature3)).toBe(
        JSON.stringify({
          ...sortedFakeData3,
          signature:
            '0a8d3a29af5e52975aef3276d8260193b2465441b05788db0ccfe4eea45b972e672f831e6320189e758dd4f5f697f84f95d5e5ba034b51f7aecf3c80abc3330e',
        }),
      );
      const isValid3 = verifyObject(signature3, FAKE_PUBLIC_KEY);
      expect(isValid3).toBe(true);

      fakeData.transaction.amount = '1';
      const signature4 = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      const sortedFakeData4 = sortPermissionRequestData(fakeData);
      expect(JSON.stringify(signature4)).toBe(
        JSON.stringify({
          ...sortedFakeData4,
          signature:
            '2ff2140b4050d8464d02a0f7e26b92d8376ec9796f43ad779c74384ac281390914592a235c88f971d91deeefed95727029d8f9999ff6460644749b551b8bff35',
        }),
      );
      const isValid4 = verifyObject(signature4, FAKE_PUBLIC_KEY);
      expect(isValid4).toBe(true);
    });
  });
});
