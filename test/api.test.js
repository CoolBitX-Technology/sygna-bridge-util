const {
  ACCEPTED,
  REJECTED,
  SYGNA_BRIDGE_CENTRAL_PUBKEY,
  SYGNA_BRIDGE_CENTRAL_PUBKEY_TEST,
  RejectCode,
} = require('../src/config');
const crypto = require('../src/crypto');
const fetch = require('node-fetch');

jest.mock('node-fetch');
fetch.mockImplementation(() => {
  return {
    json: async () => 'fetch success',
  };
});

jest.mock('../src/crypto', () => ({
  verifyObject: jest.fn().mockReturnValue(true),
}));

describe('test api', () => {
  const apiModule = require('../src/api');
  const domain = 'https://api.sygna.io/v2/bridge/';
  const api_key = '1234567890';

  beforeEach(() => {
    fetch.mockClear();
    crypto.verifyObject.mockReset();
    crypto.verifyObject.mockReturnValue(true);
  });

  describe('test getSB', () => {
    const instance = new apiModule.API(api_key, domain);

    it('should fetch be called with correct parameters if getSB is called', async () => {
      const headers = { 'x-api-key': api_key };
      const url = 'https://api.sygna.io/v2/bridge/';
      const response = await instance.getSB(url);
      expect(fetch.mock.calls[0][0]).toBe(url);
      expect(fetch.mock.calls[0][1]).toEqual({ headers });
      expect(fetch.mock.calls.length).toBe(1);
      expect(response).toBe('fetch success');
    });
  });

  describe('test postSB', () => {
    const instance = new apiModule.API(api_key, domain);

    it('should fetch be called with correct parameters if postSB is called', async () => {
      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': api_key,
      };
      //await fetch(url, { method: 'POST', body: JSON.stringify(json), headers: headers });
      const url = 'https://api.sygna.io/v2/bridge/';
      const body = {
        key: 'value',
      };
      const response = await instance.postSB(url, body);
      expect(fetch.mock.calls[0][0]).toBe(url);
      expect(fetch.mock.calls[0][1]).toEqual({
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers,
      });
      expect(fetch.mock.calls.length).toBe(1);
      expect(response).toBe('fetch success');
    });
  });

  describe('test getVASPList', () => {
    const instance = new apiModule.API(api_key, domain);
    instance.getSB = jest.fn();

    const fakeResponse = {
      vasp_data: [
        {
          vasp_code: 'AAAAAAAA798',
          vasp_name: 'AAAA',
          vasp_pubkey: '123456',
        },
        {
          vasp_code: 'ABCDKRZZ111',
          vasp_name: 'ASDFGHJKL111111',
          vasp_pubkey: '22222222222222222222222',
        },
      ],
    };

    beforeEach(() => {
      instance.getSB.mockReset();
      instance.getSB.mockImplementation(() => {
        return Promise.resolve(fakeResponse);
      });
    });

    it('should getSB be called with correct parameters if getVASPList is called', async () => {
      const response = await instance.getVASPList(false);
      expect(instance.getSB.mock.calls[0][0]).toBe(`${domain}v2/bridge/vasp`);
      expect(instance.getSB.mock.calls.length).toBe(1);
      expect(response).toEqual(fakeResponse.vasp_data);
    });

    it('should throw exception if api response is not valid', async () => {
      instance.getSB.mockImplementation(() => {
        return Promise.resolve({
          message: 'test exception',
        });
      });
      try {
        const response = await instance.getVASPList(false);
        fail('expected error was not occurred');
      } catch (error) {
        expect(error.message).toBe('Request VASPs failed: test exception');
      }
    });

    it('should verifyObject be called with correct parameters if validate is true', async () => {
      const response = await instance.getVASPList(true);
      expect(crypto.verifyObject.mock.calls[0][0]).toEqual(fakeResponse);
      expect(crypto.verifyObject.mock.calls[0][1]).toBe(
        SYGNA_BRIDGE_CENTRAL_PUBKEY_TEST,
      );
      expect(crypto.verifyObject.mock.calls.length).toBe(1);
      expect(response).toEqual(fakeResponse.vasp_data);
    });

    it('should verifyObject be called with correct parameters if validate is true and isProd is false', async () => {
      const response = await instance.getVASPList(true, false);
      expect(crypto.verifyObject.mock.calls[0][0]).toEqual(fakeResponse);
      expect(crypto.verifyObject.mock.calls[0][1]).toBe(
        SYGNA_BRIDGE_CENTRAL_PUBKEY_TEST,
      );
      expect(crypto.verifyObject.mock.calls.length).toBe(1);
      expect(response).toEqual(fakeResponse.vasp_data);
    });

    it('should verifyObject be called with correct parameters if validate is true and isProd is true', async () => {
      const response = await instance.getVASPList(true, true);
      expect(crypto.verifyObject.mock.calls[0][0]).toEqual(fakeResponse);
      expect(crypto.verifyObject.mock.calls[0][1]).toBe(
        SYGNA_BRIDGE_CENTRAL_PUBKEY,
      );
      expect(crypto.verifyObject.mock.calls.length).toBe(1);
      expect(response).toEqual(fakeResponse.vasp_data);
    });

    it('should throw exception if verifyObject failed', async () => {
      crypto.verifyObject.mockReturnValue(false);
      try {
        const response = await instance.getVASPList(true);
        fail('expected error was not occurred');
      } catch (error) {
        expect(error.message).toBe('get VASP info error: invalid signature.');
      }
    });

    it('should return response if verifyObject success', async () => {
      try {
        const response = await instance.getVASPList(true);
        expect(crypto.verifyObject.mock.calls[0][0]).toEqual(fakeResponse);
        expect(crypto.verifyObject.mock.calls[0][1]).toBe(
          SYGNA_BRIDGE_CENTRAL_PUBKEY_TEST,
        );
        expect(crypto.verifyObject.mock.calls.length).toBe(1);
        expect(response).toEqual(fakeResponse.vasp_data);
      } catch (error) {
        fail('unexpected error');
      }
    });
  });

  describe('test getVASPPublicKey', () => {
    const vasp_code = 'ABCDKRZZ111';
    const fakeVaspList = [
      {
        vasp_code: 'AAAAAAAA798',
        vasp_name: 'AAAA',
        vasp_pubkey: '123456',
      },
      {
        vasp_code: 'ABCDKRZZ111',
        vasp_name: 'ASDFGHJKL111111',
        vasp_pubkey: '22222222222222222222222',
      },
    ];
    const instance = new apiModule.API(api_key, domain);
    instance.getVASPList = jest.fn();

    beforeEach(() => {
      instance.getVASPList.mockReset();
      instance.getVASPList.mockImplementation(() => {
        return Promise.resolve(fakeVaspList);
      });
    });

    it('should getVASPList be called with correct parameters if getVASPPublicKey is called', async () => {
      await instance.getVASPPublicKey(vasp_code);
      expect(instance.getVASPList.mock.calls[0][0]).toBe(true);
      expect(instance.getVASPList.mock.calls[0][1]).toBe(false);
      expect(instance.getVASPList.mock.calls.length).toBe(1);

      await instance.getVASPPublicKey(vasp_code, false);
      expect(instance.getVASPList.mock.calls[1][0]).toBe(false);
      expect(instance.getVASPList.mock.calls[1][1]).toBe(false);
      expect(instance.getVASPList.mock.calls.length).toBe(2);

      await instance.getVASPPublicKey(vasp_code, false, true);
      expect(instance.getVASPList.mock.calls[2][0]).toBe(false);
      expect(instance.getVASPList.mock.calls[2][1]).toBe(true);
      expect(instance.getVASPList.mock.calls.length).toBe(3);

      await instance.getVASPPublicKey(vasp_code, true);
      expect(instance.getVASPList.mock.calls[3][0]).toBe(true);
      expect(instance.getVASPList.mock.calls[3][1]).toBe(false);
      expect(instance.getVASPList.mock.calls.length).toBe(4);

      await instance.getVASPPublicKey(vasp_code, true, false);
      expect(instance.getVASPList.mock.calls[4][0]).toBe(true);
      expect(instance.getVASPList.mock.calls[4][1]).toBe(false);
      expect(instance.getVASPList.mock.calls.length).toBe(5);

      await instance.getVASPPublicKey(vasp_code, true, true);
      expect(instance.getVASPList.mock.calls[5][0]).toBe(true);
      expect(instance.getVASPList.mock.calls[5][1]).toBe(true);
      expect(instance.getVASPList.mock.calls.length).toBe(6);
    });

    it('should throw exception if getVASPList failed', async () => {
      instance.getVASPList.mockImplementation(() => {
        throw new Error('getVASPList failed');
      });
      try {
        await instance.getVASPPublicKey(vasp_code);
        fail('expected error was not occurred');
      } catch (error) {
        expect(error.message).toBe('getVASPList failed');
      }
    });

    it('should throw exception if vasp not exists in api response', async () => {
      try {
        await instance.getVASPPublicKey('ABCDE');
        fail('expected error was not occurred');
      } catch (error) {
        expect(error.message).toBe('Invalid vasp_code');
      }
    });

    it('should return response if vasp exists in api response', async () => {
      try {
        const response = await instance.getVASPPublicKey(vasp_code);
        expect(response).toBe(fakeVaspList[1].vasp_pubkey);
      } catch (error) {
        fail('unexpected error');
      }
    });
  });

  describe('test postPermissionRequest', () => {
    const fakeData = {
      data: {
        private_info:
          '79676feb56c7b8c222924d945ba3d7c73333c27b7bc94e8a76cbaa643db3722695d7b822aa3d62443f3bacbdb993b45ec9421769b15b97bd085c0fc21132de4c08a4626b28ddc40481e1563245b337ffb782113e364cc94e40348577eae4a714c9764e6c206439b1d86fa97c17f33164f2a2ca343dd1d5f9e7d2c68fbb8ed58d',
        transaction: {
          originator_vasp: {
            vasp_code: 'VASPUSNY1',
            addrs: [
              {
                address: 'bnb1vynn9hamtqg9me7y6frja0rvfva9saprl55gl4',
                addr_extra_info: [],
              },
            ],
          },
          beneficiary_vasp: {
            vasp_code: 'VASPUSNY2',
            addrs: [
              {
                address: 'bnb1hj767k8nlf0jn6p3c3wvl0a66c4782a3f78d7e',
                addr_extra_info: [
                  {
                    tag: 'abc',
                  },
                ],
              },
            ],
          },
          currency_id: 'sygna:0x80000090',
          amount: '4.51120135938784',
        },
        need_validate_addr: true,
        data_dt: '2020-07-13T05:56:53.088Z',
        signature:
          '90b909183e11bdf0896fb9008c778a2e1e1a4df58c4985a853a91b6254e58514033394459f6c3948ce41a0335d89e23436c81b31dc834ff4dba93f6a20f53aee',
      },
      callback: {
        callback_url:
          'https://facb1c03d3dae42f07008d0c42979623.m.pipedream.net',
        signature:
          'be9000b96b5a86b971fe1818e23790beb33fc9d2b27d761ea70c067eb73adea06fd8aada3ec577f62e87b77ff18cb635bd48e1e33b677908b0bf92ea743c85b4',
      },
    };

    const instance = new apiModule.API(api_key, domain);
    instance.postSB = jest.fn();

    beforeEach(() => {
      instance.postSB.mockClear();
    });

    it('should postSB be called with correct data if postPermissionRequest is called', async () => {
      await instance.postPermissionRequest(fakeData);
      expect(instance.postSB.mock.calls[0][0]).toBe(
        `${domain}v2/bridge/transaction/permission-request`,
      );
      expect(JSON.stringify(instance.postSB.mock.calls[0][1])).toBe(
        JSON.stringify(fakeData),
      );
      expect(instance.postSB.mock.calls.length).toBe(1);
    });
  });

  describe('test postPermission', () => {
    const fakeData = {
      reject_code: RejectCode.BVRC001,
      transfer_id:
        '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      signature: '1234567890',
      expire_date: 123,
      permission_status: REJECTED,
      reject_message: 'test',
    };

    const instance = new apiModule.API(api_key, domain);
    instance.postSB = jest.fn();

    beforeEach(() => {
      instance.postSB.mockClear();
    });

    it('should postSB be called with correct parameters if postPermission is called', async () => {
      await instance.postPermission(fakeData);

      expect(instance.postSB.mock.calls[0][0]).toBe(
        `${domain}v2/bridge/transaction/permission`,
      );
      expect(JSON.stringify(instance.postSB.mock.calls[0][1])).toBe(
        JSON.stringify(fakeData),
      );
      expect(instance.postSB.mock.calls.length).toBe(1);
    });
  });

  describe('test getStatus', () => {
    const transfer_id =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

    const instance = new apiModule.API(api_key, domain);
    instance.getSB = jest.fn();

    beforeEach(() => {
      instance.getSB.mockClear();
    });

    it('should getSB be called with correct parameters if getStatus is called', async () => {
      await instance.getStatus(transfer_id);

      expect(instance.getSB.mock.calls[0][0]).toBe(
        `${domain}v2/bridge/transaction/status?transfer_id=${transfer_id}`,
      );
      expect(instance.getSB.mock.calls.length).toBe(1);
    });
  });

  describe('test postTransactionId', () => {
    const transfer_id =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const txid =
      '9d5f8e21aa87dd5e787b766990f74cf3a961b4e439a56670b07569c846fe375d';
    const fakeData = {
      txid,
      signature: '1234567890',
      transfer_id,
    };
    const instance = new apiModule.API(api_key, domain);
    instance.postSB = jest.fn();

    beforeEach(() => {
      instance.postSB.mockClear();
    });

    it('should postSB be called with correct parameters if postPermission is called', async () => {
      await instance.postTransactionId(fakeData);

      expect(instance.postSB.mock.calls[0][0]).toBe(
        `${domain}v2/bridge/transaction/txid`,
      );
      expect(JSON.stringify(instance.postSB.mock.calls[0][1])).toBe(
        JSON.stringify(fakeData),
      );
      expect(instance.postSB.mock.calls.length).toBe(1);
    });
  });

  describe('test postBeneficiaryEndpointUrl', () => {
    const vasp_code = 'QQQQKRQQ';
    const callback_permission_request_url =
      'https://api.sygna.io/v2/bridge/permission-request';
    const callback_txid_url = 'https://api.sygna.io/v2/bridge/txid';
    const signature =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

    const fakeData = {
      callback_permission_request_url,
      signature,
      vasp_code,
    };
    const instance = new apiModule.API(api_key, domain);
    instance.postSB = jest.fn();

    beforeEach(() => {
      instance.postSB.mockClear();
    });

    it('should postSB be called with correct parameters if postBeneficiaryEndpointUrl is called', async () => {
      await instance.postBeneficiaryEndpointUrl(fakeData);

      expect(instance.postSB.mock.calls[0][0]).toBe(
        `${domain}v2/bridge/vasp/beneficiary-endpoint-url`,
      );
      expect(JSON.stringify(instance.postSB.mock.calls[0][1])).toBe(
        JSON.stringify(fakeData),
      );
      expect(instance.postSB.mock.calls.length).toBe(1);

      const fakeData1 = {
        signature,
        callback_txid_url,
        vasp_code,
      };

      await instance.postBeneficiaryEndpointUrl(fakeData1);

      expect(instance.postSB.mock.calls[1][0]).toBe(
        `${domain}v2/bridge/vasp/beneficiary-endpoint-url`,
      );
      expect(JSON.stringify(instance.postSB.mock.calls[1][1])).toBe(
        JSON.stringify(fakeData1),
      );
      expect(instance.postSB.mock.calls.length).toBe(2);

      const fakeData2 = {
        signature,
        callback_txid_url,
        vasp_code,
        callback_permission_request_url,
      };

      await instance.postBeneficiaryEndpointUrl(fakeData2);

      expect(instance.postSB.mock.calls[2][0]).toBe(
        `${domain}v2/bridge/vasp/beneficiary-endpoint-url`,
      );
      expect(JSON.stringify(instance.postSB.mock.calls[2][1])).toBe(
        JSON.stringify(fakeData2),
      );
      expect(instance.postSB.mock.calls.length).toBe(3);

      const fakeData3 = {
        signature,
        callback_txid_url: null,
        vasp_code,
        callback_permission_request_url,
      };

      await instance.postBeneficiaryEndpointUrl(fakeData3);

      expect(instance.postSB.mock.calls[3][0]).toBe(
        `${domain}v2/bridge/vasp/beneficiary-endpoint-url`,
      );
      expect(JSON.stringify(instance.postSB.mock.calls[3][1])).toBe(
        JSON.stringify(fakeData3),
      );
      expect(instance.postSB.mock.calls.length).toBe(4);
    });
  });

  describe('test postRety', () => {
    const vasp_code = 'QQQQKRQQ';

    const fakeData = {
      vasp_code,
    };
    const instance = new apiModule.API(api_key, domain);
    instance.postSB = jest.fn();

    beforeEach(() => {
      instance.postSB.mockClear();
    });

    it('should postSB be called with postRety parameters if postRety is called', async () => {
      await instance.postRetry(fakeData);

      expect(instance.postSB.mock.calls[0][0]).toBe(
        `${domain}v2/bridge/transaction/retry`,
      );
      expect(JSON.stringify(instance.postSB.mock.calls[0][1])).toBe(
        JSON.stringify(fakeData),
      );
      expect(instance.postSB.mock.calls.length).toBe(1);
    });
  });

  describe('test getCurrencies', () => {
    const currency_id = 'sygna:0x80000090';
    const currency_name = 'XRP';
    const currency_symbol = 'XRP';

    const instance = new apiModule.API(api_key, domain);
    instance.getSB = jest.fn();

    beforeEach(() => {
      instance.getSB.mockClear();
    });

    it('should getSB be called with getCurrencies if getCurrencies is called', async () => {
      await instance.getCurrencies();

      expect(instance.getSB.mock.calls[0][0]).toBe(
        `${domain}v2/bridge/transaction/currencies`,
      );
      expect(instance.getSB.mock.calls.length).toBe(1);

      await instance.getCurrencies({ currency_id });

      expect(instance.getSB.mock.calls[1][0]).toBe(
        `${domain}v2/bridge/transaction/currencies?currency_id=${currency_id}`,
      );

      await instance.getCurrencies({ currency_id, currency_symbol });

      expect(instance.getSB.mock.calls[2][0]).toBe(
        `${domain}v2/bridge/transaction/currencies?currency_id=${currency_id}&currency_symbol=${currency_symbol}`,
      );

      await instance.getCurrencies({ currency_name, currency_symbol });

      expect(instance.getSB.mock.calls[3][0]).toBe(
        `${domain}v2/bridge/transaction/currencies?currency_name=${currency_name}&currency_symbol=${currency_symbol}`,
      );
    });
  });
});
