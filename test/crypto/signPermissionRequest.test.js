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
          amount: 1,
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
          amount: 1,
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
          amount: 1,
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
          amount: 1,
          beneficiary_vasp_code: 'VASPTWTP2',
        },
      };
      const signature = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      const sortedFakeData = sortPermissionRequestData(fakeData);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...sortedFakeData,
          signature:
            'c7b9c1edc35e17dc0a78858d68786e5bcb26bbc09d02a0e1747e7eeabdc59d4e79c6d1156359a06b1662084d782bd86f4bdc6cc5aa6696f20c5ea8e20fa328e8',
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
            '2727bc6be48b780bfd4712c2f8bfa39bcc24e7e2aa48e8fbfa02789b8bac31443c8dc991731108bddabc52761dc9bf97cb5938838c3c28fae1c4fcd31e5a7c5c',
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
            'c758a58cc6920a3179c45a467d5cd7e297ba725c0c6fafd391f15e7345de7592344f8fa6f9a7c5433dd4e43da08f4d27ad17b2664697218df9bf7bce18fcd841',
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
            '0b647c4803731fb6aa58613f979d38e01e1f69d953a104a326941c1700e2b2d6450da8d26f7490c323ec340c0274996b38527649f3cc4ef4fbfd65af69afbe28',
        }),
      );
      const isValid3 = verifyObject(signature3, FAKE_PUBLIC_KEY);
      expect(isValid3).toBe(true);
    });
  });
});
