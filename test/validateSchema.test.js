const { ACCEPTED, REJECTED, RejectCode, RejectMessage } = require('../src/config');
const { validateSchema } = require('../src/utils/validateSchema');
const permission_request_schema = require('../src/schema/permission_request.json');
const permission_schema = require('../src/schema/permission.json');
const permission_request_with_signature_schema = require('../src/schema/permission_request_with_signature.json');
const permission_with_signature_schema = require('../src/schema/permission_with_signature.json');
const callback_schema = require('../src/schema/callback.json');

describe('test validateSchema', () => {
  describe('test validate permission_request_schema', () => {
    const private_info = "123";
    const transaction = {
      originator_addrs: ['123'],
      originator_vasp_code: "123",
      originator_addrs_extra: { DT: '001' },
      beneficiary_vasp_code: '123',
      beneficiary_addrs: ['123'],
      beneficiary_addrs_extra: { DT: '002' },
      transaction_currency: "123",
      amount: 1
    };
    const data_dt = '2019-07-29T06:29:00.123Z';
    const expire_date = 2529024749000;

    it('should validate failed if private_info is not valid', () => {
      const data = {};
      const valid = validateSchema(data, permission_request_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'private_info\'');

      data.private_info = 123;
      const valid1 = validateSchema(data, permission_request_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.private_info');
      expect(message1).toEqual('should be string');

      data.private_info = '';
      const valid2 = validateSchema(data, permission_request_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.private_info');
      expect(message2).toEqual('should NOT be shorter than 1 characters');
    });

    it('should validate failed if transaction is not valid', () => {
      const data = { private_info };
      const valid = validateSchema(data, permission_request_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'transaction\'');

      data.transaction = 123;
      const valid1 = validateSchema(data, permission_request_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction');
      expect(message1).toEqual('should be object');
    });

    it('should validate failed if transaction.originator_vasp_code is not valid', () => {
      const data = { private_info, transaction: {} };
      const valid = validateSchema(data, permission_request_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.transaction');
      expect(message).toEqual('should have required property \'originator_vasp_code\'');

      data.transaction.originator_vasp_code = 123;
      const valid1 = validateSchema(data, permission_request_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.originator_vasp_code');
      expect(message1).toEqual('should be string');

      data.transaction.originator_vasp_code = '';
      const valid2 = validateSchema(data, permission_request_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transaction.originator_vasp_code');
      expect(message2).toEqual('should NOT be shorter than 1 characters');
    });

    it('should validate failed if transaction.originator_addrs is not valid', () => {
      const data = { private_info, transaction: { originator_vasp_code: "123" } };
      const valid = validateSchema(data, permission_request_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.transaction');
      expect(message).toEqual('should have required property \'originator_addrs\'');

      data.transaction.originator_addrs = 123;
      const valid1 = validateSchema(data, permission_request_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.originator_addrs');
      expect(message1).toEqual('should be array');

      data.transaction.originator_addrs = [];
      const valid2 = validateSchema(data, permission_request_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transaction.originator_addrs');
      expect(message2).toEqual('should NOT have fewer than 1 items');

      data.transaction.originator_addrs[0] = 123;
      const valid3 = validateSchema(data, permission_request_schema);
      expect(valid3[0]).toBe(false);
      const { dataPath: dataPath3, message: message3 } = valid3[1][0];
      expect(dataPath3).toEqual('.transaction.originator_addrs[0]');
      expect(message3).toEqual('should be string');

      data.transaction.originator_addrs[0] = '';
      const valid4 = validateSchema(data, permission_request_schema);
      expect(valid4[0]).toBe(false);
      const { dataPath: dataPath4, message: message4 } = valid4[1][0];
      expect(dataPath4).toEqual('.transaction.originator_addrs[0]');
      expect(message4).toEqual('should NOT be shorter than 1 characters');
    });

    it('should validate failed if transaction.originator_addrs_extra is not valid', () => {
      const data = {
        private_info,
        transaction: {
          originator_vasp_code: "123",
          originator_addrs: ['123'],
          originator_addrs_extra: 123
        }
      };
      const valid = validateSchema(data, permission_request_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.transaction.originator_addrs_extra');
      expect(message).toEqual('should be object');

      data.transaction.originator_addrs_extra = {};
      const valid1 = validateSchema(data, permission_request_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.originator_addrs_extra');
      expect(message1).toEqual('should NOT have fewer than 1 properties');
    });

    it('should validate failed if transaction.beneficiary_vasp_code is not valid', () => {
      const data = {
        private_info,
        transaction: {
          originator_vasp_code: "123",
          originator_addrs: ['123']
        }
      };
      const valid = validateSchema(data, permission_request_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.transaction');
      expect(message).toEqual('should have required property \'beneficiary_vasp_code\'');

      data.transaction.beneficiary_vasp_code = 123;
      const valid1 = validateSchema(data, permission_request_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.beneficiary_vasp_code');
      expect(message1).toEqual('should be string');

      data.transaction.beneficiary_vasp_code = '';
      const valid2 = validateSchema(data, permission_request_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transaction.beneficiary_vasp_code');
      expect(message2).toEqual('should NOT be shorter than 1 characters');
    });

    it('should validate failed if transaction.beneficiary_addrs is not valid', () => {
      const data = {
        private_info,
        transaction: {
          originator_vasp_code: "123",
          originator_addrs: ['123'],
          beneficiary_vasp_code: "123"
        }
      };
      const valid = validateSchema(data, permission_request_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.transaction');
      expect(message).toEqual('should have required property \'beneficiary_addrs\'');

      data.transaction.beneficiary_addrs = 123;
      const valid1 = validateSchema(data, permission_request_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.beneficiary_addrs');
      expect(message1).toEqual('should be array');

      data.transaction.beneficiary_addrs = [];
      const valid2 = validateSchema(data, permission_request_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transaction.beneficiary_addrs');
      expect(message2).toEqual('should NOT have fewer than 1 items');

      data.transaction.beneficiary_addrs[0] = 123;
      const valid3 = validateSchema(data, permission_request_schema);
      expect(valid3[0]).toBe(false);
      const { dataPath: dataPath3, message: message3 } = valid3[1][0];
      expect(dataPath3).toEqual('.transaction.beneficiary_addrs[0]');
      expect(message3).toEqual('should be string');

      data.transaction.beneficiary_addrs[0] = '';
      const valid4 = validateSchema(data, permission_request_schema);
      expect(valid4[0]).toBe(false);
      const { dataPath: dataPath4, message: message4 } = valid4[1][0];
      expect(dataPath4).toEqual('.transaction.beneficiary_addrs[0]');
      expect(message4).toEqual('should NOT be shorter than 1 characters');
    });

    it('should validate failed if transaction.beneficiary_addrs_extra is not valid', () => {
      const data = {
        private_info: "private_info",
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: "123",
          originator_addrs_extra: { DT: '001' },
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          beneficiary_addrs_extra: 123
        }
      };
      const valid = validateSchema(data, permission_request_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.transaction.beneficiary_addrs_extra');
      expect(message).toEqual('should be object');

      data.transaction.beneficiary_addrs_extra = {};
      const valid1 = validateSchema(data, permission_request_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.beneficiary_addrs_extra');
      expect(message1).toEqual('should NOT have fewer than 1 properties');
    });

    it('should validate failed if transaction.transaction_currency is not valid', () => {
      const data = {
        private_info: "private_info",
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: "123",
          originator_addrs_extra: { DT: '001' },
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          beneficiary_addrs_extra: { DT: '002' }
        }
      };
      const valid = validateSchema(data, permission_request_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'transaction_currency\'');

      data.transaction.transaction_currency = 123;
      const valid1 = validateSchema(data, permission_request_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.transaction_currency');
      expect(message1).toEqual('should be string');

      data.transaction.transaction_currency = '';
      const valid2 = validateSchema(data, permission_request_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transaction.transaction_currency');
      expect(message2).toEqual('should NOT be shorter than 1 characters');
    });

    it('should validate failed if transaction.amount is not valid', () => {
      const data = {
        private_info: "private_info",
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: "123",
          originator_addrs_extra: { DT: '001' },
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          beneficiary_addrs_extra: { DT: '002' },
          transaction_currency: "123"
        }
      };
      const valid = validateSchema(data, permission_request_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'amount\'');

      data.transaction.amount = "123";
      const valid1 = validateSchema(data, permission_request_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.amount');
      expect(message1).toEqual('should be number');

      data.transaction.amount = 0;
      const valid2 = validateSchema(data, permission_request_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transaction.amount');
      expect(message2).toEqual('should be > 0');
    });

    it('should validate failed if data_dt is not valid', () => {
      const data = {
        private_info,
        transaction
      };
      const valid = validateSchema(data, permission_request_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'data_dt\'');

      data.data_dt = "2019";
      const valid1 = validateSchema(data, permission_request_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.data_dt');
      expect(message1).toEqual('should match format \"date-time\"');

      data.data_dt = '';
      const valid2 = validateSchema(data, permission_request_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.data_dt');
      expect(message2).toEqual('should match format \"date-time\"');
    });

    it('should validate failed if expire_date is not valid', () => {
      const data = {
        private_info,
        transaction,
        data_dt,
        expire_date: "123"
      };
      const valid = validateSchema(data, permission_request_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.expire_date');
      expect(message).toEqual('should be number');

      data.expire_date = 0;
      const valid2 = validateSchema(data, permission_request_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.expire_date');
      expect(message2).toEqual('should be > 0');
    });

    it('should validate success', () => {
      const data = {
        private_info,
        transaction,
        data_dt
      };
      const valid = validateSchema(data, permission_request_schema);
      expect(valid[0]).toBe(true);

      data.transaction.originator_addrs_extra = { DT: '001' };
      data.transaction.beneficiary_addrs_extra = { DT: '002' };

      const valid1 = validateSchema(data, permission_request_schema);
      expect(valid1[0]).toBe(true);

      data.expire_date = expire_date;
      const valid2 = validateSchema(data, permission_request_schema);
      expect(valid2[0]).toBe(true);

    });
  });

  describe('test validate permission_request_with_signature_schema', () => {
    const private_info = "123";
    const transaction = {
      originator_addrs: ['123'],
      originator_vasp_code: "123",
      originator_addrs_extra: { DT: '001' },
      beneficiary_vasp_code: '123',
      beneficiary_addrs: ['123'],
      beneficiary_addrs_extra: { DT: '002' },
      transaction_currency: "123",
      amount: 1
    };
    const data_dt = '2019-07-29T06:29:00.123Z';
    const expire_date = 2529024749000;
    const signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

    it('should validate failed if private_info is not valid', () => {
      const data = {};
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'private_info\'');

      data.private_info = 123;
      const valid1 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.private_info');
      expect(message1).toEqual('should be string');

      data.private_info = '';
      const valid2 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.private_info');
      expect(message2).toEqual('should NOT be shorter than 1 characters');
    });

    it('should validate failed if transaction is not valid', () => {
      const data = { private_info };
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'transaction\'');

      data.transaction = 123;
      const valid1 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction');
      expect(message1).toEqual('should be object');
    });

    it('should validate failed if transaction.originator_vasp_code is not valid', () => {
      const data = { private_info, transaction: {} };
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.transaction');
      expect(message).toEqual('should have required property \'originator_vasp_code\'');

      data.transaction.originator_vasp_code = 123;
      const valid1 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.originator_vasp_code');
      expect(message1).toEqual('should be string');

      data.transaction.originator_vasp_code = '';
      const valid2 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transaction.originator_vasp_code');
      expect(message2).toEqual('should NOT be shorter than 1 characters');
    });

    it('should validate failed if transaction.originator_addrs is not valid', () => {
      const data = { private_info, transaction: { originator_vasp_code: "123" } };
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.transaction');
      expect(message).toEqual('should have required property \'originator_addrs\'');

      data.transaction.originator_addrs = 123;
      const valid1 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.originator_addrs');
      expect(message1).toEqual('should be array');

      data.transaction.originator_addrs = [];
      const valid2 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transaction.originator_addrs');
      expect(message2).toEqual('should NOT have fewer than 1 items');

      data.transaction.originator_addrs[0] = 123;
      const valid3 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid3[0]).toBe(false);
      const { dataPath: dataPath3, message: message3 } = valid3[1][0];
      expect(dataPath3).toEqual('.transaction.originator_addrs[0]');
      expect(message3).toEqual('should be string');

      data.transaction.originator_addrs[0] = '';
      const valid4 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid4[0]).toBe(false);
      const { dataPath: dataPath4, message: message4 } = valid4[1][0];
      expect(dataPath4).toEqual('.transaction.originator_addrs[0]');
      expect(message4).toEqual('should NOT be shorter than 1 characters');
    });

    it('should validate failed if transaction.originator_addrs_extra is not valid', () => {
      const data = {
        private_info,
        transaction: {
          originator_vasp_code: "123",
          originator_addrs: ['123'],
          originator_addrs_extra: 123
        }
      };
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.transaction.originator_addrs_extra');
      expect(message).toEqual('should be object');

      data.transaction.originator_addrs_extra = {};
      const valid1 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.originator_addrs_extra');
      expect(message1).toEqual('should NOT have fewer than 1 properties');
    });

    it('should validate failed if transaction.beneficiary_vasp_code is not valid', () => {
      const data = {
        private_info,
        transaction: {
          originator_vasp_code: "123",
          originator_addrs: ['123']
        }
      };
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.transaction');
      expect(message).toEqual('should have required property \'beneficiary_vasp_code\'');

      data.transaction.beneficiary_vasp_code = 123;
      const valid1 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.beneficiary_vasp_code');
      expect(message1).toEqual('should be string');

      data.transaction.beneficiary_vasp_code = '';
      const valid2 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transaction.beneficiary_vasp_code');
      expect(message2).toEqual('should NOT be shorter than 1 characters');
    });

    it('should validate failed if transaction.beneficiary_addrs is not valid', () => {
      const data = {
        private_info,
        transaction: {
          originator_vasp_code: "123",
          originator_addrs: ['123'],
          beneficiary_vasp_code: "123"
        }
      };
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.transaction');
      expect(message).toEqual('should have required property \'beneficiary_addrs\'');

      data.transaction.beneficiary_addrs = 123;
      const valid1 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.beneficiary_addrs');
      expect(message1).toEqual('should be array');

      data.transaction.beneficiary_addrs = [];
      const valid2 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transaction.beneficiary_addrs');
      expect(message2).toEqual('should NOT have fewer than 1 items');

      data.transaction.beneficiary_addrs[0] = 123;
      const valid3 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid3[0]).toBe(false);
      const { dataPath: dataPath3, message: message3 } = valid3[1][0];
      expect(dataPath3).toEqual('.transaction.beneficiary_addrs[0]');
      expect(message3).toEqual('should be string');

      data.transaction.beneficiary_addrs[0] = '';
      const valid4 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid4[0]).toBe(false);
      const { dataPath: dataPath4, message: message4 } = valid4[1][0];
      expect(dataPath4).toEqual('.transaction.beneficiary_addrs[0]');
      expect(message4).toEqual('should NOT be shorter than 1 characters');
    });

    it('should validate failed if transaction.beneficiary_addrs_extra is not valid', () => {
      const data = {
        private_info: "private_info",
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: "123",
          originator_addrs_extra: { DT: '001' },
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          beneficiary_addrs_extra: 123
        }
      };
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.transaction.beneficiary_addrs_extra');
      expect(message).toEqual('should be object');

      data.transaction.beneficiary_addrs_extra = {};
      const valid1 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.beneficiary_addrs_extra');
      expect(message1).toEqual('should NOT have fewer than 1 properties');
    });

    it('should validate failed if transaction.transaction_currency is not valid', () => {
      const data = {
        private_info: "private_info",
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: "123",
          originator_addrs_extra: { DT: '001' },
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          beneficiary_addrs_extra: { DT: '002' }
        }
      };
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'transaction_currency\'');

      data.transaction.transaction_currency = 123;
      const valid1 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.transaction_currency');
      expect(message1).toEqual('should be string');

      data.transaction.transaction_currency = '';
      const valid2 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transaction.transaction_currency');
      expect(message2).toEqual('should NOT be shorter than 1 characters');
    });

    it('should validate failed if transaction.amount is not valid', () => {
      const data = {
        private_info: "private_info",
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: "123",
          originator_addrs_extra: { DT: '001' },
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          beneficiary_addrs_extra: { DT: '002' },
          transaction_currency: "123"
        }
      };
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'amount\'');

      data.transaction.amount = "123";
      const valid1 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transaction.amount');
      expect(message1).toEqual('should be number');

      data.transaction.amount = 0;
      const valid2 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transaction.amount');
      expect(message2).toEqual('should be > 0');
    });

    it('should validate failed if data_dt is not valid', () => {
      const data = {
        private_info,
        transaction
      };
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'data_dt\'');

      data.data_dt = "2019";
      const valid1 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.data_dt');
      expect(message1).toEqual('should match format \"date-time\"');

      data.data_dt = '';
      const valid2 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.data_dt');
      expect(message2).toEqual('should match format \"date-time\"');
    });

    it('should validate failed if expire_date is not valid', () => {
      const data = {
        private_info,
        transaction,
        data_dt,
        expire_date: "123"
      };
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.expire_date');
      expect(message).toEqual('should be number');

      data.expire_date = 0;
      const valid2 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.expire_date');
      expect(message2).toEqual('should be > 0');
    });

    it('should validate failed if signature is not valid', () => {
      const data = {
        private_info,
        transaction,
        data_dt,
        expire_date
      };
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'signature\'');

      data.signature = 0;
      const valid2 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.signature');
      expect(message2).toEqual('should be string');

      data.signature = '';
      const valid3 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid3[0]).toBe(false);
      const { dataPath: dataPath3, message: message3 } = valid3[1][0];
      expect(dataPath3).toEqual('.signature');
      expect(message3).toEqual('should NOT be shorter than 128 characters');

      data.signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
      const valid4 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid4[0]).toBe(false);
      const { dataPath: dataPath4, message: message4 } = valid4[1][0];
      expect(dataPath4).toEqual('.signature');
      expect(message4).toEqual('should NOT be longer than 128 characters');

    });

    it('should validate success', () => {
      const data = {
        private_info,
        transaction,
        data_dt,
        signature
      };
      const valid = validateSchema(data, permission_request_with_signature_schema);
      expect(valid[0]).toBe(true);

      data.transaction.originator_addrs_extra = { DT: '001' };
      data.transaction.beneficiary_addrs_extra = { DT: '002' };

      const valid1 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid1[0]).toBe(true);

      data.expire_date = expire_date;
      const valid2 = validateSchema(data, permission_request_with_signature_schema);
      expect(valid2[0]).toBe(true);

    });
  });

  describe('test validate permission_schema', () => {
    const transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const permission_status = ACCEPTED;
    const expire_date = 2529024749000;
    it('should validate failed if transfer_id is not valid', () => {
      const data = {};
      const valid = validateSchema(data, permission_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'transfer_id\'');

      data.transfer_id = '';
      const valid1 = validateSchema(data, permission_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transfer_id');
      expect(message1).toEqual('should NOT be shorter than 64 characters');

      data.transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
      const valid2 = validateSchema(data, permission_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transfer_id');
      expect(message2).toEqual('should NOT be longer than 64 characters');

    });

    it('validate failedif permission_status is not valid', () => {
      const data = { transfer_id };
      const valid = validateSchema(data, permission_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'permission_status\'');

      data.permission_status = 123;
      const valid1 = validateSchema(data, permission_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.permission_status');
      expect(message1).toEqual('should be string');

      data.permission_status = '';
      const valid2 = validateSchema(data, permission_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.permission_status');
      expect(message2).toEqual('should NOT be shorter than 1 characters');

      data.permission_status = '123';
      const valid3 = validateSchema(data, permission_schema);
      expect(valid3[0]).toBe(false);
      const { dataPath: dataPath3, params, message: message3 } = valid3[1][0];
      expect(dataPath3).toEqual('.permission_status');
      expect(params.allowedValues).toEqual([ACCEPTED, REJECTED]);
      expect(message3).toEqual('should be equal to one of the allowed values');
    });

    it('should validate failed if expire_date is not valid', () => {
      const data = {
        transfer_id,
        permission_status,
        expire_date: "123"
      };
      const valid = validateSchema(data, permission_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.expire_date');
      expect(message).toEqual('should be number');

      data.expire_date = 0;
      const valid2 = validateSchema(data, permission_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.expire_date');
      expect(message2).toEqual('should be > 0');
    });

    it('validate failedif reject_code is not valid', () => {
      const data = {
        transfer_id,
        permission_status,
        expire_date,
        reject_code: 123
      };
      const valid = validateSchema(data, permission_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.reject_code');
      expect(message).toEqual('should be string');

      data.reject_code = '';
      const valid1 = validateSchema(data, permission_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.reject_code');
      expect(message1).toEqual('should NOT be shorter than 1 characters');

      const reject_codes = Object.keys(RejectCode).map(function (key) {
        return RejectCode[key]
      });
      data.reject_code = '123';
      const valid2 = validateSchema(data, permission_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, params, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.reject_code');
      expect(params.allowedValues).toEqual(reject_codes);
      expect(message2).toEqual('should be equal to one of the allowed values');
    });

    it('validate failedif reject_message is not valid', () => {
      const data = {
        transfer_id,
        permission_status,
        expire_date,
        reject_code: RejectCode.BVRC001,
        reject_message: 123
      };
      const valid = validateSchema(data, permission_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.reject_message');
      expect(message).toEqual('should be string');

      data.reject_message = '';
      const valid1 = validateSchema(data, permission_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.reject_message');
      expect(message1).toEqual('should NOT be shorter than 1 characters');

      const reject_messagess = Object.keys(RejectMessage).map(function (key) {
        return RejectMessage[key]
      });
      data.reject_message = '123';
      const valid2 = validateSchema(data, permission_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, params, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.reject_message');
      expect(params.allowedValues).toEqual(reject_messagess);
      expect(message2).toEqual('should be equal to one of the allowed values');
    });

    it('should validate success', () => {
      const data = {
        transfer_id,
        permission_status,
      };
      const valid = validateSchema(data, permission_schema);
      expect(valid[0]).toBe(true);

      data.permission_status = REJECTED;
      data.reject_code = RejectCode.BVRC001;
      data.reject_message = RejectMessage.BVRC001;
      const valid1 = validateSchema(data, permission_schema);
      expect(valid1[0]).toBe(true);

      data.expire_date = expire_date;
      const valid2 = validateSchema(data, permission_schema);
      expect(valid2[0]).toBe(true);
    });

  });

  describe('test validate permission_with_signature_schema', () => {
    const transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const permission_status = ACCEPTED;
    const expire_date = 2529024749000;
    const signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

    it('should validate failed if transfer_id is not valid', () => {
      const data = {};
      const valid = validateSchema(data, permission_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'transfer_id\'');

      data.transfer_id = '';
      const valid1 = validateSchema(data, permission_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.transfer_id');
      expect(message1).toEqual('should NOT be shorter than 64 characters');

      data.transfer_id = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
      const valid2 = validateSchema(data, permission_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.transfer_id');
      expect(message2).toEqual('should NOT be longer than 64 characters');

    });

    it('validate failedif permission_status is not valid', () => {
      const data = { transfer_id };
      const valid = validateSchema(data, permission_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'permission_status\'');

      data.permission_status = 123;
      const valid1 = validateSchema(data, permission_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.permission_status');
      expect(message1).toEqual('should be string');

      data.permission_status = '';
      const valid2 = validateSchema(data, permission_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.permission_status');
      expect(message2).toEqual('should NOT be shorter than 1 characters');

      data.permission_status = '123';
      const valid3 = validateSchema(data, permission_with_signature_schema);
      expect(valid3[0]).toBe(false);
      const { dataPath: dataPath3, params, message: message3 } = valid3[1][0];
      expect(dataPath3).toEqual('.permission_status');
      expect(params.allowedValues).toEqual([ACCEPTED, REJECTED]);
      expect(message3).toEqual('should be equal to one of the allowed values');
    });

    it('should validate failed if expire_date is not valid', () => {
      const data = {
        transfer_id,
        permission_status,
        expire_date: "123"
      };
      const valid = validateSchema(data, permission_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.expire_date');
      expect(message).toEqual('should be number');

      data.expire_date = 0;
      const valid2 = validateSchema(data, permission_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.expire_date');
      expect(message2).toEqual('should be > 0');
    });

    it('validate failedif reject_code is not valid', () => {
      const data = {
        transfer_id,
        permission_status,
        expire_date,
        reject_code: 123
      };
      const valid = validateSchema(data, permission_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.reject_code');
      expect(message).toEqual('should be string');

      data.reject_code = '';
      const valid1 = validateSchema(data, permission_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.reject_code');
      expect(message1).toEqual('should NOT be shorter than 1 characters');

      const reject_codes = Object.keys(RejectCode).map(function (key) {
        return RejectCode[key]
      });
      data.reject_code = '123';
      const valid2 = validateSchema(data, permission_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, params, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.reject_code');
      expect(params.allowedValues).toEqual(reject_codes);
      expect(message2).toEqual('should be equal to one of the allowed values');
    });

    it('validate failedif reject_message is not valid', () => {
      const data = {
        transfer_id,
        permission_status,
        expire_date,
        reject_code: RejectCode.BVRC001,
        reject_message: 123
      };
      const valid = validateSchema(data, permission_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { dataPath, message } = valid[1][0];
      expect(dataPath).toEqual('.reject_message');
      expect(message).toEqual('should be string');

      data.reject_message = '';
      const valid1 = validateSchema(data, permission_with_signature_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.reject_message');
      expect(message1).toEqual('should NOT be shorter than 1 characters');

      const reject_messagess = Object.keys(RejectMessage).map(function (key) {
        return RejectMessage[key]
      });
      data.reject_message = '123';
      const valid2 = validateSchema(data, permission_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, params, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.reject_message');
      expect(params.allowedValues).toEqual(reject_messagess);
      expect(message2).toEqual('should be equal to one of the allowed values');
    });

    it('should validate failed if signature is not valid', () => {
      const data = {
        transfer_id,
        permission_status,
        expire_date
      };
      const valid = validateSchema(data, permission_with_signature_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'signature\'');

      data.signature = 0;
      const valid2 = validateSchema(data, permission_with_signature_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.signature');
      expect(message2).toEqual('should be string');

      data.signature = '';
      const valid3 = validateSchema(data, permission_with_signature_schema);
      expect(valid3[0]).toBe(false);
      const { dataPath: dataPath3, message: message3 } = valid3[1][0];
      expect(dataPath3).toEqual('.signature');
      expect(message3).toEqual('should NOT be shorter than 128 characters');

      data.signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
      const valid4 = validateSchema(data, permission_with_signature_schema);
      expect(valid4[0]).toBe(false);
      const { dataPath: dataPath4, message: message4 } = valid4[1][0];
      expect(dataPath4).toEqual('.signature');
      expect(message4).toEqual('should NOT be longer than 128 characters');

    });

    it('should validate success', () => {
      const data = {
        transfer_id,
        permission_status,
        signature
      };
      const valid = validateSchema(data, permission_with_signature_schema);
      expect(valid[0]).toBe(true);

      data.permission_status = REJECTED;
      data.reject_code = RejectCode.BVRC001;
      data.reject_message = RejectMessage.BVRC001;
      const valid1 = validateSchema(data, permission_with_signature_schema);
      expect(valid1[0]).toBe(true);

      data.expire_date = expire_date;
      const valid2 = validateSchema(data, permission_with_signature_schema);
      expect(valid2[0]).toBe(true);
    });

  });

  describe('test validate callback_schema', () => {
    const callback_url = "http://google.com";
    const signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    it('should validate failed if callback_url is not valid', () => {
      const data = {};
      const valid = validateSchema(data, callback_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'callback_url\'');

      data.callback_url = 123;
      const valid1 = validateSchema(data, callback_schema);
      expect(valid1[0]).toBe(false);
      const { dataPath: dataPath1, message: message1 } = valid1[1][0];
      expect(dataPath1).toEqual('.callback_url');
      expect(message1).toEqual('should be string');

      data.callback_url = 'abcde';
      const valid2 = validateSchema(data, callback_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.callback_url');
      expect(message2).toEqual('should match format \"uri\"');
    });

    it('should validate failed if signature is not valid', () => {
      const data = {
        callback_url
      };
      const valid = validateSchema(data, callback_schema);
      expect(valid[0]).toBe(false);
      const { message } = valid[1][0];
      expect(message).toEqual('should have required property \'signature\'');

      data.signature = 0;
      const valid2 = validateSchema(data, callback_schema);
      expect(valid2[0]).toBe(false);
      const { dataPath: dataPath2, message: message2 } = valid2[1][0];
      expect(dataPath2).toEqual('.signature');
      expect(message2).toEqual('should be string');

      data.signature = '';
      const valid3 = validateSchema(data, callback_schema);
      expect(valid3[0]).toBe(false);
      const { dataPath: dataPath3, message: message3 } = valid3[1][0];
      expect(dataPath3).toEqual('.signature');
      expect(message3).toEqual('should NOT be shorter than 128 characters');

      data.signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
      const valid4 = validateSchema(data, callback_schema);
      expect(valid4[0]).toBe(false);
      const { dataPath: dataPath4, message: message4 } = valid4[1][0];
      expect(dataPath4).toEqual('.signature');
      expect(message4).toEqual('should NOT be longer than 128 characters');

    });

    it('should validate success', () => {
      const data = {
        callback_url,
        signature
      };
      const valid = validateSchema(data, callback_schema);
      expect(valid[0]).toBe(true);

    });
  })



});