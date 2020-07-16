const _ = require('lodash');

const { FAKE_PRIVATE_KEY, FAKE_PUBLIC_KEY } = require('../fakeKeys');

const { validatePrivateKey } = require('../../src/utils');

jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils'),
  validatePrivateKey: jest.fn(),
}));

describe('test signPermissionRequest', () => {
  let crypto;
  jest.isolateModules(() => {
    crypto = require('../../src/crypto');
  });

  const fakeData = {
    data_dt: '2019-07-29T06:29:00.123Z',
    private_info:
      '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
    transaction: {
      originator_vasp: {
        vasp_code: 'VASPJPJT4',
        addrs: [
          {
            address: 'bnb1vynn9hamtqg9me7y6frja0rvfva9saprl55gl4',
            addr_extra_info: [
              {
                memo_text: '634346542',
              },
            ],
          },
        ],
      },
      beneficiary_vasp: {
        vasp_code: 'VASPJPJT3',
        addrs: [
          {
            address: 'bnb1hj767k8nlf0jn6p3c3wvl0r0qfwfrvuxrqlxce',
            addr_extra_info: [
              {
                memo_text: 'Idzl1532434853',
              },
            ],
          },
        ],
      },
      currency_id:
        'sygna:0x800002ca.bnb1u9j9hkst6gf09dkdvxlj7puk8c7vh68a0kkmht',
      amount: '0.1234',
    },
  };

  describe('test mock', () => {
    const crypto = require('../../src/crypto');
    crypto.signObject = jest.fn();

    const { signPermissionRequest } = crypto;
    beforeEach(() => {
      crypto.signObject.mockClear();
      validatePrivateKey.mockClear();
    });

    it('should validatePrivateKey be called with correct parameters if signPermissionRequest is called', () => {
      const cloneData = _.cloneDeep(fakeData);
      signPermissionRequest(cloneData, 123);
      expect(validatePrivateKey.mock.calls.length).toBe(1);
      expect(validatePrivateKey.mock.calls[0][0]).toEqual(123);

      signPermissionRequest(cloneData, 'abc');
      expect(validatePrivateKey.mock.calls.length).toBe(2);
      expect(validatePrivateKey.mock.calls[1][0]).toEqual('abc');

      validatePrivateKey.mockReset();
      validatePrivateKey.mockImplementation(() => {
        throw new Error('error from validatePrivateKey');
      });
      try {
        signPermissionRequest(cloneData, 'def');
        fail('expected error was not occurred');
      } catch (error) {
        const { message } = error;
        expect(message).toEqual('error from validatePrivateKey');
      }
      validatePrivateKey.mockReset();
    });

    it('should signObject be called with correct parameters if signPermissionRequest is called', () => {
      const cloneData = _.cloneDeep(fakeData);
      signPermissionRequest(cloneData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(
        JSON.stringify(cloneData),
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);

      cloneData.expire_date = 123;
      signPermissionRequest(cloneData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(2);
      expect(JSON.stringify(crypto.signObject.mock.calls[1][0])).toBe(
        JSON.stringify(cloneData),
      );
      expect(crypto.signObject.mock.calls[1][1]).toEqual(FAKE_PRIVATE_KEY);
    });
  });

  describe('test signature', () => {
    const { signPermissionRequest, verifyObject } = crypto;

    it('should object which is return by signPermissionRequest be correct', () => {
      const cloneData = _.cloneDeep(fakeData);
      const signature = signPermissionRequest(cloneData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...cloneData,
          signature:
            '3818d740a75e3698eaab4843d6e9c718f3c52518fa9573db095eaa3c91ef164151084241036a7c68d3c9eb69cfbdaf409b4482d1aca5a3769fdc45a7d06837bb',
        }),
      );

      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      delete cloneData.signature;
      cloneData.expire_date = 2529024749000;
      const signature1 = signPermissionRequest(cloneData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature1)).toBe(
        JSON.stringify({
          ...cloneData,
          signature:
            '16bff17516d619042cb5b46815403bea09c058e4643879b10ab26b64e366299b1961119c3e63b5f494dddc52b90490d1abbc4bbb2ca1ab38bee81b57411240e0',
        }),
      );
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);

      delete cloneData.signature;
      cloneData.transaction.originator_vasp.addrs[0].addr_extra_info = [
        {
          DT: '001',
        },
      ];
      const signature2 = signPermissionRequest(cloneData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature2)).toBe(
        JSON.stringify({
          ...cloneData,
          signature:
            'e1f3be1fb01bf67c0b8718215a8524cdc3fa1ff6b203491caf13cf80b76727643e315cff4eee612f7c53be2f05a0a842ab2e6f7b33b9a7123f128969c20e15f8',
        }),
      );
      const isValid2 = verifyObject(signature2, FAKE_PUBLIC_KEY);
      expect(isValid2).toBe(true);

      delete cloneData.signature;
      cloneData.need_validate_addr = true;
      const signature3 = signPermissionRequest(cloneData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature3)).toBe(
        JSON.stringify({
          ...cloneData,
          signature:
            'b5ccfc27297fed4c40e9a0dedcf042c1601d6d4b9b0f799145ee074964cc203912e30639d046c83a1c77ebbde8fe30710473ff1d1c175aff6f7f85fe42b48713',
        }),
      );
      const isValid3 = verifyObject(signature3, FAKE_PUBLIC_KEY);
      expect(isValid3).toBe(true);
    });
  });
});
