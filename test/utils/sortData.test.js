const {
  sortCallbackData,
  sortTxIdData,
  sortPermissionData,
  sortPermissionRequestData,
  sortPostPermissionData,
  sortPostPermissionRequestData,
  sortPostTransactionIdData
} = require('../../src/utils/sortData');

const {
  ACCEPTED,
  REJECTED,
  RejectCode
} = require('../../src/config');

describe('test sortData', () => {
  describe('test sortCallbackData', () => {
    it('should return sorted data', () => {
      const fakeData = {
        callback_url: 'https://google.com'
      };
      expect(JSON.stringify(sortCallbackData(fakeData))).toBe(JSON.stringify(
        {
          callback_url: fakeData.callback_url
        }
      ))
    });
    it('should ignore additional key', () => {
      const fakeData = {
        callback_url: 'https://google.com',
        callback_url1: 'https://stackoverflow.com/'
      };
      expect(JSON.stringify(sortCallbackData(fakeData))).toBe(JSON.stringify(
        {
          callback_url: fakeData.callback_url
        }
      ))
    });
  });

  describe('test sortTxIdData', () => {
    it('should return sorted data', () => {
      const fakeData = {
        txid: '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe473d',
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
      };
      expect(JSON.stringify(sortTxIdData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          txid: fakeData.txid
        }
      ));
    });
    it('should ignore additional key', () => {
      const fakeData = {
        txid: '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe473d',
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        transaction: '12345'
      };
      expect(JSON.stringify(sortTxIdData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          txid: fakeData.txid
        }
      ))
    });
  });

  describe('test sortPermissionData', () => {
    it('should return sorted data', () => {
      let fakeData = {
        permission_status: ACCEPTED,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
      };
      expect(JSON.stringify(sortPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status
        }
      ));

      fakeData = {
        exprie_date: 123,
        permission_status: ACCEPTED,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
      };
      expect(JSON.stringify(sortPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          expire_date: fakeData.expire_date
        }
      ));

      fakeData = {
        permission_status: REJECTED,
        reject_code: RejectCode.BVRC001,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
      };
      expect(JSON.stringify(sortPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          reject_code: fakeData.reject_code
        }
      ));

      fakeData = {
        expire_date: 123,
        reject_code: RejectCode.BVRC001,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        permission_status: REJECTED
      };
      expect(JSON.stringify(sortPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          expire_date: fakeData.expire_date,
          reject_code: fakeData.reject_code
        }
      ));

      fakeData = {
        reject_code: RejectCode.BVRC001,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        permission_status: REJECTED,
        reject_message: 'test'
      };
      expect(JSON.stringify(sortPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          reject_code: fakeData.reject_code,
          reject_message: fakeData.reject_message
        }
      ));

      fakeData = {
        reject_code: RejectCode.BVRC001,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        expire_date: 123,
        permission_status: REJECTED,
        reject_message: 'test'
      };
      expect(JSON.stringify(sortPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          expire_date: fakeData.expire_date,
          reject_code: fakeData.reject_code,
          reject_message: fakeData.reject_message
        }
      ));
    });

    it('should ignore additional key', () => {
      const fakeData = {
        permission_status: ACCEPTED,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        key: '123'
      };
      expect(JSON.stringify(sortPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status
        }
      ));
    });

    it('should ignore reject_code and reject_message if ACCPETED', () => {
      const fakeData = {
        permission_status: ACCEPTED,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        reject_code: RejectCode.BVRC001
      };
      expect(JSON.stringify(sortPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status
        }
      ));

      fakeData.reject_message = 'test';
      expect(JSON.stringify(sortPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status
        }
      ));

      fakeData.expire_date = 123;
      expect(JSON.stringify(sortPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          expire_date: fakeData.expire_date,
        }
      ));
    });

  });

  describe('test sortPermissionRequestData', () => {
    it('should return sorted data', () => {
      let fakeData = {
        data_dt: '2019-07-29T06:29:00.123Z',
        private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        transaction: {
          transaction_currency: '0x80000000',
          originator_addrs: [
            '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
          ],
          originator_vasp_code: 'VASPTWTP1',
          beneficiary_addrs: [
            '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
          ],
          amount: 1,
          beneficiary_vasp_code: 'VASPTWTP2'
        }
      };
      expect(JSON.stringify(sortPermissionRequestData(fakeData))).toBe(JSON.stringify(
        {
          private_info: fakeData.private_info,
          transaction: {
            originator_vasp_code: fakeData.transaction.originator_vasp_code,
            originator_addrs: fakeData.transaction.originator_addrs,
            beneficiary_vasp_code: fakeData.transaction.beneficiary_vasp_code,
            beneficiary_addrs: fakeData.transaction.beneficiary_addrs,
            transaction_currency: fakeData.transaction.transaction_currency,
            amount: fakeData.transaction.amount
          },
          data_dt: fakeData.data_dt,
        }
      ));

      fakeData = {
        transaction: {
          amount: 1,
          originator_addrs: [
            '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
          ],
          transaction_currency: '0x80000000',
          beneficiary_addrs: [
            '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
          ],
          beneficiary_vasp_code: 'VASPTWTP2',
          originator_vasp_code: 'VASPTWTP1',
          originator_addrs_extra: { 'DT': '001' }
        },
        data_dt: '2019-07-29T06:29:00.123Z',
        private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918'
      };
      expect(JSON.stringify(sortPermissionRequestData(fakeData))).toBe(JSON.stringify(
        {
          private_info: fakeData.private_info,
          transaction: {
            originator_vasp_code: fakeData.transaction.originator_vasp_code,
            originator_addrs: fakeData.transaction.originator_addrs,
            originator_addrs_extra: fakeData.transaction.originator_addrs_extra,
            beneficiary_vasp_code: fakeData.transaction.beneficiary_vasp_code,
            beneficiary_addrs: fakeData.transaction.beneficiary_addrs,
            transaction_currency: fakeData.transaction.transaction_currency,
            amount: fakeData.transaction.amount
          },
          data_dt: fakeData.data_dt,
        }
      ));

      fakeData = {
        private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        data_dt: '2019-07-29T06:29:00.123Z',
        transaction: {
          amount: 1,
          transaction_currency: '0x80000000',
          originator_addrs_extra: { 'DT': '001' },
          originator_addrs: [
            '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
          ],
          beneficiary_addrs_extra: { 'DT': '002' },
          beneficiary_vasp_code: 'VASPTWTP2',
          beneficiary_addrs: [
            '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
          ],
          originator_vasp_code: 'VASPTWTP1'
        }
      };
      expect(JSON.stringify(sortPermissionRequestData(fakeData))).toBe(JSON.stringify(
        {
          private_info: fakeData.private_info,
          transaction: {
            originator_vasp_code: fakeData.transaction.originator_vasp_code,
            originator_addrs: fakeData.transaction.originator_addrs,
            originator_addrs_extra: fakeData.transaction.originator_addrs_extra,
            beneficiary_vasp_code: fakeData.transaction.beneficiary_vasp_code,
            beneficiary_addrs: fakeData.transaction.beneficiary_addrs,
            beneficiary_addrs_extra: fakeData.transaction.beneficiary_addrs_extra,
            transaction_currency: fakeData.transaction.transaction_currency,
            amount: fakeData.transaction.amount
          },
          data_dt: fakeData.data_dt,
        }
      ));

      fakeData = {
        data_dt: '2019-07-29T06:29:00.123Z',
        expire_date: 123,
        transaction: {
          beneficiary_vasp_code: 'VASPTWTP2',
          amount: 1,
          originator_addrs: [
            '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
          ],
          originator_addrs_extra: { 'DT': '001' },
          beneficiary_addrs_extra: { 'DT': '002' },
          originator_vasp_code: 'VASPTWTP1',
          beneficiary_addrs: [
            '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
          ],
          transaction_currency: '0x80000000',
        },
        private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918'
      };
      expect(JSON.stringify(sortPermissionRequestData(fakeData))).toBe(JSON.stringify(
        {
          private_info: fakeData.private_info,
          transaction: {
            originator_vasp_code: fakeData.transaction.originator_vasp_code,
            originator_addrs: fakeData.transaction.originator_addrs,
            originator_addrs_extra: fakeData.transaction.originator_addrs_extra,
            beneficiary_vasp_code: fakeData.transaction.beneficiary_vasp_code,
            beneficiary_addrs: fakeData.transaction.beneficiary_addrs,
            beneficiary_addrs_extra: fakeData.transaction.beneficiary_addrs_extra,
            transaction_currency: fakeData.transaction.transaction_currency,
            amount: fakeData.transaction.amount
          },
          data_dt: fakeData.data_dt,
          expire_date: fakeData.expire_date
        }
      ));
    });


    it('should ignore additional key', () => {
      const fakeData = {
        data_dt: '2019-07-29T06:29:00.123Z',
        private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
        transaction: {
          transaction_currency: '0x80000000',
          originator_addrs: [
            '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
          ],
          originator_vasp_code: 'VASPTWTP1',
          beneficiary_addrs: [
            '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
          ],
          amount: 1,
          beneficiary_vasp_code: 'VASPTWTP2',
          key: 123
        },
        key: '123'
      };
      expect(JSON.stringify(sortPermissionRequestData(fakeData))).toBe(JSON.stringify(
        {
          private_info: fakeData.private_info,
          transaction: {
            originator_vasp_code: fakeData.transaction.originator_vasp_code,
            originator_addrs: fakeData.transaction.originator_addrs,
            beneficiary_vasp_code: fakeData.transaction.beneficiary_vasp_code,
            beneficiary_addrs: fakeData.transaction.beneficiary_addrs,
            transaction_currency: fakeData.transaction.transaction_currency,
            amount: fakeData.transaction.amount
          },
          data_dt: fakeData.data_dt,
        }
      ))
    });
  });

  describe('test sortPostTransactionIdData', () => {
    it('should return sorted data', () => {
      let fakeData = {
        signature: '1234567890',
        txid: '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe473d',
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
      };
      expect(JSON.stringify(sortPostTransactionIdData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          txid: fakeData.txid,
          signature: fakeData.signature
        }
      ));

      fakeData = {
        txid: '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe473d',
        signature: '1234567890',
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
      };
      expect(JSON.stringify(sortPostTransactionIdData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          txid: fakeData.txid,
          signature: fakeData.signature
        }
      ));

      fakeData = {
        txid: '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe473d',
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        signature: '1234567890'
      };
      expect(JSON.stringify(sortPostTransactionIdData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          txid: fakeData.txid,
          signature: fakeData.signature
        }
      ));
    });

    it('should ignore additional key', () => {
      const fakeData = {
        txid: '9d5f8e32aa87dd5e787b766912345cf3a961b4e439a56670b07569c846fe473d',
        signature: '1234567890',
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        transaction: '12345'
      };
      expect(JSON.stringify(sortPostTransactionIdData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          txid: fakeData.txid,
          signature: fakeData.signature
        }
      ))
    });
  });

  describe('test sortPostPermissionData', () => {
    it('should return sorted data', () => {
      let fakeData = {
        signature: '1234567890',
        permission_status: ACCEPTED,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
      };
      expect(JSON.stringify(sortPostPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          signature: fakeData.signature
        }
      ));

      fakeData = {
        exprie_date: 123,
        permission_status: ACCEPTED,
        signature: '1234567890',
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
      };
      expect(JSON.stringify(sortPostPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          expire_date: fakeData.expire_date,
          signature: fakeData.signature
        }
      ));

      fakeData = {
        permission_status: REJECTED,
        reject_code: RejectCode.BVRC001,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        signature: '1234567890'
      };
      expect(JSON.stringify(sortPostPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          reject_code: fakeData.reject_code,
          signature: fakeData.signature
        }
      ));

      fakeData = {
        signature: '1234567890',
        expire_date: 123,
        reject_code: RejectCode.BVRC001,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        permission_status: REJECTED
      };
      expect(JSON.stringify(sortPostPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          expire_date: fakeData.expire_date,
          reject_code: fakeData.reject_code,
          signature: fakeData.signature
        }
      ));

      fakeData = {
        reject_code: RejectCode.BVRC001,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        permission_status: REJECTED,
        signature: '1234567890',
        reject_message: 'test'
      };
      expect(JSON.stringify(sortPostPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          reject_code: fakeData.reject_code,
          reject_message: fakeData.reject_message,
          signature: fakeData.signature
        }
      ));

      fakeData = {
        reject_code: RejectCode.BVRC001,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        signature: '1234567890',
        expire_date: 123,
        permission_status: REJECTED,
        reject_message: 'test'
      };
      expect(JSON.stringify(sortPostPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          expire_date: fakeData.expire_date,
          reject_code: fakeData.reject_code,
          reject_message: fakeData.reject_message,
          signature: fakeData.signature
        }
      ));
    });

    it('should ignore additional key', () => {
      const fakeData = {
        signature: '1234567890',
        permission_status: ACCEPTED,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        key: '123'
      };
      expect(JSON.stringify(sortPostPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          signature: fakeData.signature
        }
      ));
    });

    it('should ignore reject_code and reject_message if ACCPETED', () => {
      const fakeData = {
        permission_status: ACCEPTED,
        transfer_id: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
        reject_code: RejectCode.BVRC001,
        signature: '1234567890'
      };
      expect(JSON.stringify(sortPostPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          signature: fakeData.signature
        }
      ));

      fakeData.reject_message = 'test';
      expect(JSON.stringify(sortPostPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          signature: fakeData.signature
        }
      ));

      fakeData.expire_date = 123;
      expect(JSON.stringify(sortPostPermissionData(fakeData))).toBe(JSON.stringify(
        {
          transfer_id: fakeData.transfer_id,
          permission_status: fakeData.permission_status,
          expire_date: fakeData.expire_date,
          signature: fakeData.signature
        }
      ));
    });

  });

  describe('test sortPostPermissionRequestData', () => {
    it('should return sorted data', () => {
      let fakeData = {
        data: {
          data_dt: '2019-07-29T06:29:00.123Z',
          private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
          signature: '1234567890',
          transaction: {
            transaction_currency: '0x80000000',
            originator_addrs: [
              '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
            ],
            originator_vasp_code: 'VASPTWTP1',
            beneficiary_addrs: [
              '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
            ],
            amount: 1,
            beneficiary_vasp_code: 'VASPTWTP2'
          }
        },
        callback: {
          signature: '1234567890',
          callback_url: 'https://google.com'
        }

      };
      expect(JSON.stringify(sortPostPermissionRequestData(fakeData))).toBe(JSON.stringify(
        {
          data: {
            private_info: fakeData.data.private_info,
            transaction: {
              originator_vasp_code: fakeData.data.transaction.originator_vasp_code,
              originator_addrs: fakeData.data.transaction.originator_addrs,
              beneficiary_vasp_code: fakeData.data.transaction.beneficiary_vasp_code,
              beneficiary_addrs: fakeData.data.transaction.beneficiary_addrs,
              transaction_currency: fakeData.data.transaction.transaction_currency,
              amount: fakeData.data.transaction.amount
            },
            data_dt: fakeData.data.data_dt,
            signature: fakeData.data.signature
          },
          callback: {
            callback_url: fakeData.callback.callback_url,
            signature: fakeData.callback.signature
          }
        }
      ));

      fakeData = {
        data: {
          transaction: {
            amount: 1,
            originator_addrs: [
              '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
            ],
            transaction_currency: '0x80000000',
            beneficiary_addrs: [
              '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
            ],
            beneficiary_vasp_code: 'VASPTWTP2',
            originator_vasp_code: 'VASPTWTP1',
            originator_addrs_extra: { 'DT': '001' }
          },
          data_dt: '2019-07-29T06:29:00.123Z',
          signature: '1234567890',
          private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918'
        },
        callback: {
          signature: '1234567890',
          callback_url: 'https://google.com'
        }

      };
      expect(JSON.stringify(sortPostPermissionRequestData(fakeData))).toBe(JSON.stringify(
        {
          data: {
            private_info: fakeData.data.private_info,
            transaction: {
              originator_vasp_code: fakeData.data.transaction.originator_vasp_code,
              originator_addrs: fakeData.data.transaction.originator_addrs,
              originator_addrs_extra: fakeData.data.transaction.originator_addrs_extra,
              beneficiary_vasp_code: fakeData.data.transaction.beneficiary_vasp_code,
              beneficiary_addrs: fakeData.data.transaction.beneficiary_addrs,
              transaction_currency: fakeData.data.transaction.transaction_currency,
              amount: fakeData.data.transaction.amount
            },
            data_dt: fakeData.data.data_dt,
            signature: fakeData.data.signature
          },
          callback: {
            callback_url: fakeData.callback.callback_url,
            signature: fakeData.callback.signature
          }
        }
      ));

      fakeData = {
        data: {
          private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
          data_dt: '2019-07-29T06:29:00.123Z',
          transaction: {
            amount: 1,
            transaction_currency: '0x80000000',
            originator_addrs_extra: { 'DT': '001' },
            originator_addrs: [
              '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
            ],
            beneficiary_addrs_extra: { 'DT': '002' },
            beneficiary_vasp_code: 'VASPTWTP2',
            beneficiary_addrs: [
              '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
            ],
            originator_vasp_code: 'VASPTWTP1'
          },
          signature: '1234567890'
        },
        callback: {
          signature: '1234567890',
          callback_url: 'https://google.com'
        }
      };
      expect(JSON.stringify(sortPostPermissionRequestData(fakeData))).toBe(JSON.stringify(
        {
          data: {
            private_info: fakeData.data.private_info,
            transaction: {
              originator_vasp_code: fakeData.data.transaction.originator_vasp_code,
              originator_addrs: fakeData.data.transaction.originator_addrs,
              originator_addrs_extra: fakeData.data.transaction.originator_addrs_extra,
              beneficiary_vasp_code: fakeData.data.transaction.beneficiary_vasp_code,
              beneficiary_addrs: fakeData.data.transaction.beneficiary_addrs,
              beneficiary_addrs_extra: fakeData.data.transaction.beneficiary_addrs_extra,
              transaction_currency: fakeData.data.transaction.transaction_currency,
              amount: fakeData.data.transaction.amount
            },
            data_dt: fakeData.data.data_dt,
            signature: fakeData.data.signature
          },
          callback: {
            callback_url: fakeData.callback.callback_url,
            signature: fakeData.callback.signature
          }
        }
      ));

      fakeData = {
        data: {
          signature: '1234567890',
          data_dt: '2019-07-29T06:29:00.123Z',
          expire_date: 123,
          transaction: {
            beneficiary_vasp_code: 'VASPTWTP2',
            amount: 1,
            originator_addrs: [
              '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
            ],
            originator_addrs_extra: { 'DT': '001' },
            beneficiary_addrs_extra: { 'DT': '002' },
            originator_vasp_code: 'VASPTWTP1',
            beneficiary_addrs: [
              '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
            ],
            transaction_currency: '0x80000000',
          },
          private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918'
        },
        callback: {
          signature: '1234567890',
          callback_url: 'https://google.com'
        }
      };
      expect(JSON.stringify(sortPostPermissionRequestData(fakeData))).toBe(JSON.stringify(
        {
          data: {
            private_info: fakeData.data.private_info,
            transaction: {
              originator_vasp_code: fakeData.data.transaction.originator_vasp_code,
              originator_addrs: fakeData.data.transaction.originator_addrs,
              originator_addrs_extra: fakeData.data.transaction.originator_addrs_extra,
              beneficiary_vasp_code: fakeData.data.transaction.beneficiary_vasp_code,
              beneficiary_addrs: fakeData.data.transaction.beneficiary_addrs,
              beneficiary_addrs_extra: fakeData.data.transaction.beneficiary_addrs_extra,
              transaction_currency: fakeData.data.transaction.transaction_currency,
              amount: fakeData.data.transaction.amount
            },
            data_dt: fakeData.data.data_dt,
            expire_date: fakeData.data.expire_date,
            signature: fakeData.data.signature
          },
          callback: {
            callback_url: fakeData.callback.callback_url,
            signature: fakeData.callback.signature
          }
        }
      ));
    });


    it('should ignore additional key', () => {
      const fakeData = {
        data: {
          data_dt: '2019-07-29T06:29:00.123Z',
          signature: '1234567890',
          private_info: '6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
          transaction: {
            transaction_currency: '0x80000000',
            originator_addrs: [
              '16bUGjvunVp7LqygLHrTvHyvbvfeuRCWAh'
            ],
            originator_vasp_code: 'VASPTWTP1',
            beneficiary_addrs: [
              '3CHgkx946yyueucCMiJhyH2Vg5kBBvfSGH'
            ],
            amount: 1,
            beneficiary_vasp_code: 'VASPTWTP2',
            key: 123
          },
          key: '123'
        },
        callback: {
          key: '123',
          signature: '1234567890',
          callback_url: 'https://google.com'
        }
      };
      expect(JSON.stringify(sortPostPermissionRequestData(fakeData))).toBe(JSON.stringify(
        {
          data: {
            private_info: fakeData.data.private_info,
            transaction: {
              originator_vasp_code: fakeData.data.transaction.originator_vasp_code,
              originator_addrs: fakeData.data.transaction.originator_addrs,
              beneficiary_vasp_code: fakeData.data.transaction.beneficiary_vasp_code,
              beneficiary_addrs: fakeData.data.transaction.beneficiary_addrs,
              transaction_currency: fakeData.data.transaction.transaction_currency,
              amount: fakeData.data.transaction.amount
            },
            data_dt: fakeData.data.data_dt,
            signature: fakeData.data.signature
          },
          callback: {
            callback_url: fakeData.callback.callback_url,
            signature: fakeData.callback.signature
          }
        }
      ))
    });
  });

});