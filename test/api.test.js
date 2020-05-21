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
  const domain = 'https://api.sygna.io/api/v1.1.0/bridge/';
  const api_key = '1234567890';

  beforeEach(() => {
    fetch.mockClear();
    crypto.verifyObject.mockReset();
    crypto.verifyObject.mockReturnValue(true);
  });

  describe('test getSB', () => {
    const instance = new apiModule.API(api_key, domain);

    it('should fetch be called with correct parameters if getSB is called', async () => {
      const headers = { api_key };
      const url = 'https://api.sygna.io/api/v1.1.0/bridge/';
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
        api_key,
      };
      //await fetch(url, { method: 'POST', body: JSON.stringify(json), headers: headers });
      const url = 'https://api.sygna.io/api/v1.1.0/bridge/';
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
          is_sb_need_static: false,
          vasp_pubkey: '123456',
        },
        {
          vasp_code: 'ABCDKRZZ111',
          vasp_name: 'ASDFGHJKL111111',
          is_sb_need_static: true,
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
      expect(instance.getSB.mock.calls[0][0]).toBe(
        `${domain}api/v1.1.0/bridge/vasp`,
      );
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
        is_sb_need_static: false,
        vasp_pubkey: '123456',
      },
      {
        vasp_code: 'ABCDKRZZ111',
        vasp_name: 'ASDFGHJKL111111',
        is_sb_need_static: true,
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
        expire_date: 123,
        transaction: {
          amount: 1,
          transaction_currency: '0x80000000',
          originator_addrs_extra: { DT: '001' },
          originator_addrs: ['16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'],
          beneficiary_addrs_extra: { DT: '002' },
          beneficiary_vasp_code: 'VASPTWTP2',
          beneficiary_addrs: ['3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'],
          originator_vasp_code: 'VASPTWTP1',
        },
        private_info:
          '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        signature: '1234567890',
        data_dt: '2019-07-29T06:29:00.123Z',
      },
      callback: {
        signature: '1234567890',
        callback_url: 'https://api.sygna.io/api/v1.1.0/bridge/',
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
        `${domain}api/v1.1.0/bridge/transaction/permission-request`,
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
        `${domain}api/v1.1.0/bridge/transaction/permission`,
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
        `${domain}api/v1.1.0/bridge/transaction/status?transfer_id=${transfer_id}`,
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
        `${domain}api/v1.1.0/bridge/transaction/txid`,
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
      'https://api.sygna.io/api/v1.1.0/bridge/permission-request';
    const callback_txid_url = 'https://api.sygna.io/api/v1.1.0/bridge/txid';
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
        `${domain}api/v1.1.0/bridge/vasp/beneficiary-endpoint-url`,
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
        `${domain}api/v1.1.0/bridge/vasp/beneficiary-endpoint-url`,
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
        `${domain}api/v1.1.0/bridge/vasp/beneficiary-endpoint-url`,
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
        `${domain}api/v1.1.0/bridge/vasp/beneficiary-endpoint-url`,
      );
      expect(JSON.stringify(instance.postSB.mock.calls[3][1])).toBe(
        JSON.stringify(fakeData3),
      );
      expect(instance.postSB.mock.calls.length).toBe(4);
    });
  });
});
