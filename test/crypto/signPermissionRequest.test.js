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
  describe('test mock', () => {
    const crypto = require('../../src/crypto');
    crypto.signObject = jest.fn();

    const { signPermissionRequest } = crypto;
    beforeEach(() => {
      crypto.signObject.mockClear();
      validatePrivateKey.mockClear();
    });

    it('should validatePrivateKey be called with correct parameters if signPermissionRequest is called', () => {
      const fakeData = {
        data_dt: '2019-07-29T06:29:00.123Z',
        private_info:
          '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        signature: '1234567890',
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
          title: 'Transaction',
          description: 'Please see [Transaction](ref:transaction)',
          example: {
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
        },
      };
      signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(1);
      expect(JSON.stringify(crypto.signObject.mock.calls[0][0])).toBe(
        JSON.stringify(fakeData),
      );
      expect(crypto.signObject.mock.calls[0][1]).toEqual(FAKE_PRIVATE_KEY);

      fakeData.expire_date = 123;
      signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      expect(crypto.signObject.mock.calls.length).toBe(2);
      expect(JSON.stringify(crypto.signObject.mock.calls[1][0])).toBe(
        JSON.stringify(fakeData),
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
          originator_vasp: {
            vasp_code: 'VASPJPJT4',
            addrs: [
              {
                address: 'bnb1vynn9hamtqg9me7y6frja0rvfva9saprl55gl4',
              },
            ],
          },
          beneficiary_vasp: {
            vasp_code: 'VASPJPJT3',
            addrs: [
              {
                address: 'bnb1hj767k8nlf0jn6p3c3wvl0r0qfwfrvuxrqlxce',
              },
            ],
          },
          currency_id:
            'sygna:0x800002ca.bnb1u9j9hkst6gf09dkdvxlj7puk8c7vh68a0kkmht',
          amount: '0.1234',
        },
      };
      const signature = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature)).toBe(
        JSON.stringify({
          ...fakeData,
          signature:
            '02234ca0d321b8e5c00f5cf81fc5c8f69234a712d820abb1633c6fc1bb0808c2171cb7b96e972d369b7aa700ccc7e6ca9d0de28e1b53e5fa7a2d7d9a6550536b',
        }),
      );

      const isValid = verifyObject(signature, FAKE_PUBLIC_KEY);
      expect(isValid).toBe(true);

      delete fakeData.signature;
      fakeData.expire_date = 2529024749000;
      const signature1 = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature1)).toBe(
        JSON.stringify({
          ...fakeData,
          signature:
            '2378723939dd98533d6e9e5dd02d5fd0c46651445d462a1e10d71e39d9b41a2d44dc81d41c16a65ae607583ff990b880252f265473fed2de64d4657235e19a34',
        }),
      );
      const isValid1 = verifyObject(signature1, FAKE_PUBLIC_KEY);
      expect(isValid1).toBe(true);

      delete fakeData.signature;
      fakeData.transaction.originator_vasp.addrs[0].addr_extra_info = {
        DT: '001',
      };
      const signature2 = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature2)).toBe(
        JSON.stringify({
          ...fakeData,
          signature:
            '568eed81f0cc96d9542833f988528d6afc223c365bde8db3419b1123c8d96f3d6bcf704df307555b768e9e68ae6036637749cbc9dbdcede09c1182518778e69b',
        }),
      );
      const isValid2 = verifyObject(signature2, FAKE_PUBLIC_KEY);
      expect(isValid2).toBe(true);

      delete fakeData.signature;
      fakeData.transaction.beneficiary_vasp.addrs[0].addr_extra_info = {
        DT: '002',
      };
      const signature3 = signPermissionRequest(fakeData, FAKE_PRIVATE_KEY);
      expect(JSON.stringify(signature3)).toBe(
        JSON.stringify({
          ...fakeData,
          signature:
            'b465ce6753576b1b28723c77ccb633ad13786523362c2061f96d7b48155d0a1c31b544213cf50f146d0bc2855160413d1a407737bfc71cfd06b09eb20b766ae8',
        }),
      );
      const isValid3 = verifyObject(signature3, FAKE_PUBLIC_KEY);
      expect(isValid3).toBe(true);
    });
  });
});
