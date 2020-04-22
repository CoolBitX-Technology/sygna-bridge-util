const {
  validatePermissionRequestSchema,
} = require('../../../src/utils/validateSchema');

describe('test validate permission_request_schema', () => {
  const private_info = '123';
  const transaction = {
    originator_addrs: ['123'],
    originator_vasp_code: '123',
    originator_addrs_extra: { DT: '001' },
    beneficiary_vasp_code: '123',
    beneficiary_addrs: ['123'],
    beneficiary_addrs_extra: { DT: '002' },
    transaction_currency: '123',
    amount: '1.0',
  };
  const data_dt = '2019-07-29T06:29:00.123Z';
  const expire_date = 2529024749000;

  it('should validate failed if private_info is not valid', () => {
    const data = {};
    const valid = validatePermissionRequestSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property 'private_info'");

    data.private_info = 123;
    const valid1 = validatePermissionRequestSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.private_info');
    expect(message1).toEqual('should be string');

    data.private_info = '';
    const valid2 = validatePermissionRequestSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.private_info');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if transaction is not valid', () => {
    const data = { private_info };
    const valid = validatePermissionRequestSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property 'transaction'");

    data.transaction = 123;
    const valid1 = validatePermissionRequestSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transaction');
    expect(message1).toEqual('should be object');
  });

  it('should validate failed if transaction.originator_vasp_code is not valid', () => {
    const data = { private_info, transaction: {} };
    const valid = validatePermissionRequestSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transaction');
    expect(message).toEqual(
      "should have required property 'originator_vasp_code'",
    );

    data.transaction.originator_vasp_code = 123;
    const valid1 = validatePermissionRequestSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transaction.originator_vasp_code');
    expect(message1).toEqual('should be string');

    data.transaction.originator_vasp_code = '';
    const valid2 = validatePermissionRequestSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transaction.originator_vasp_code');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if transaction.originator_addrs is not valid', () => {
    const data = { private_info, transaction: { originator_vasp_code: '123' } };
    const valid = validatePermissionRequestSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transaction');
    expect(message).toEqual("should have required property 'originator_addrs'");

    data.transaction.originator_addrs = 123;
    const valid1 = validatePermissionRequestSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transaction.originator_addrs');
    expect(message1).toEqual('should be array');

    data.transaction.originator_addrs = [];
    const valid2 = validatePermissionRequestSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transaction.originator_addrs');
    expect(message2).toEqual('should NOT have fewer than 1 items');

    data.transaction.originator_addrs[0] = 123;
    const valid3 = validatePermissionRequestSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.transaction.originator_addrs[0]');
    expect(message3).toEqual('should be string');

    data.transaction.originator_addrs[0] = '';
    const valid4 = validatePermissionRequestSchema(data);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.transaction.originator_addrs[0]');
    expect(message4).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if transaction.originator_addrs_extra is not valid', () => {
    const data = {
      private_info,
      transaction: {
        originator_vasp_code: '123',
        originator_addrs: ['123'],
        originator_addrs_extra: 123,
      },
    };
    const valid = validatePermissionRequestSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transaction.originator_addrs_extra');
    expect(message).toEqual('should be object');

    data.transaction.originator_addrs_extra = {};
    const valid1 = validatePermissionRequestSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transaction.originator_addrs_extra');
    expect(message1).toEqual('should NOT have fewer than 1 properties');
  });

  it('should validate failed if transaction.beneficiary_vasp_code is not valid', () => {
    const data = {
      private_info,
      transaction: {
        originator_vasp_code: '123',
        originator_addrs: ['123'],
      },
    };
    const valid = validatePermissionRequestSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transaction');
    expect(message).toEqual(
      "should have required property 'beneficiary_vasp_code'",
    );

    data.transaction.beneficiary_vasp_code = 123;
    const valid1 = validatePermissionRequestSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transaction.beneficiary_vasp_code');
    expect(message1).toEqual('should be string');

    data.transaction.beneficiary_vasp_code = '';
    const valid2 = validatePermissionRequestSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transaction.beneficiary_vasp_code');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if transaction.beneficiary_addrs is not valid', () => {
    const data = {
      private_info,
      transaction: {
        originator_vasp_code: '123',
        originator_addrs: ['123'],
        beneficiary_vasp_code: '123',
      },
    };
    const valid = validatePermissionRequestSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transaction');
    expect(message).toEqual(
      "should have required property 'beneficiary_addrs'",
    );

    data.transaction.beneficiary_addrs = 123;
    const valid1 = validatePermissionRequestSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transaction.beneficiary_addrs');
    expect(message1).toEqual('should be array');

    data.transaction.beneficiary_addrs = [];
    const valid2 = validatePermissionRequestSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transaction.beneficiary_addrs');
    expect(message2).toEqual('should NOT have fewer than 1 items');

    data.transaction.beneficiary_addrs[0] = 123;
    const valid3 = validatePermissionRequestSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.transaction.beneficiary_addrs[0]');
    expect(message3).toEqual('should be string');

    data.transaction.beneficiary_addrs[0] = '';
    const valid4 = validatePermissionRequestSchema(data);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.transaction.beneficiary_addrs[0]');
    expect(message4).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if transaction.beneficiary_addrs_extra is not valid', () => {
    const data = {
      private_info: 'private_info',
      transaction: {
        originator_addrs: ['123'],
        originator_vasp_code: '123',
        originator_addrs_extra: { DT: '001' },
        beneficiary_vasp_code: '123',
        beneficiary_addrs: ['123'],
        beneficiary_addrs_extra: 123,
      },
    };
    const valid = validatePermissionRequestSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transaction.beneficiary_addrs_extra');
    expect(message).toEqual('should be object');

    data.transaction.beneficiary_addrs_extra = {};
    const valid1 = validatePermissionRequestSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transaction.beneficiary_addrs_extra');
    expect(message1).toEqual('should NOT have fewer than 1 properties');
  });

  it('should validate failed if transaction.transaction_currency is not valid', () => {
    const data = {
      private_info: 'private_info',
      transaction: {
        originator_addrs: ['123'],
        originator_vasp_code: '123',
        originator_addrs_extra: { DT: '001' },
        beneficiary_vasp_code: '123',
        beneficiary_addrs: ['123'],
        beneficiary_addrs_extra: { DT: '002' },
      },
    };
    const valid = validatePermissionRequestSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transaction');
    expect(message).toEqual(
      "should have required property 'transaction_currency'",
    );

    data.transaction.transaction_currency = 123;
    const valid1 = validatePermissionRequestSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transaction.transaction_currency');
    expect(message1).toEqual('should be string');

    data.transaction.transaction_currency = '';
    const valid2 = validatePermissionRequestSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transaction.transaction_currency');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if transaction.amount is not valid', () => {
    const data = {
      private_info: 'private_info',
      transaction: {
        originator_addrs: ['123'],
        originator_vasp_code: '123',
        originator_addrs_extra: { DT: '001' },
        beneficiary_vasp_code: '123',
        beneficiary_addrs: ['123'],
        beneficiary_addrs_extra: { DT: '002' },
        transaction_currency: '123',
      },
    };
    const valid = validatePermissionRequestSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transaction');
    expect(message).toEqual("should have required property 'amount'");

    data.transaction.amount = 123;
    const valid1 = validatePermissionRequestSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transaction.amount');
    expect(message1).toEqual('should be string');

    data.transaction.amount = 'abc';
    const valid2 = validatePermissionRequestSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transaction.amount');
    expect(message2).toEqual('should match pattern "^\\d*\\.?\\d*$"');
  });

  it('should validate failed if data_dt is not valid', () => {
    const data = {
      private_info,
      transaction,
    };
    const valid = validatePermissionRequestSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property 'data_dt'");

    data.data_dt = '2019';
    const valid1 = validatePermissionRequestSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.data_dt');
    expect(message1).toEqual('should match format "date-time"');

    data.data_dt = '';
    const valid2 = validatePermissionRequestSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.data_dt');
    expect(message2).toEqual('should match format "date-time"');
  });

  it('should validate failed if expire_date is not valid', () => {
    const data = {
      private_info,
      transaction,
      data_dt,
      expire_date: '123',
    };
    const valid = validatePermissionRequestSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.expire_date');
    expect(message).toEqual('should be number');

    data.expire_date = -1;
    const valid2 = validatePermissionRequestSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.expire_date');
    expect(message2).toEqual('should be >= 0');
  });

  it('should validate success', () => {
    const data = {
      private_info,
      transaction,
      data_dt,
    };
    const valid = validatePermissionRequestSchema(data);
    expect(valid[0]).toBe(true);

    data.transaction.originator_addrs_extra = { DT: '001' };
    data.transaction.beneficiary_addrs_extra = { DT: '002' };

    const valid1 = validatePermissionRequestSchema(data);
    expect(valid1[0]).toBe(true);

    data.expire_date = expire_date;
    const valid2 = validatePermissionRequestSchema(data);
    expect(valid2[0]).toBe(true);
  });
});
