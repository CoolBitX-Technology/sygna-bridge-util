const { validatePostPermissionRequestSchema } = require('../../../src/utils/validateSchema');
const post_permission_request_schema = require('../../../src/schema/api_input/post_permission_request.json');

describe('test validate post_permission_request_schema', () => {
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
  const callback_url = "http://google.com";

  it('should validate failed if data is not valid', () => {
    const data = {};
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'data\'');

    data.data = 123;
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.data');
    expect(message1).toEqual('should be object');
  });

  it('should validate failed if data.private_info is not valid', () => {
    const data = {
      data: {}
    };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.data');
    expect(message).toEqual('should have required property \'private_info\'');

    data.data.private_info = 123;
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.data.private_info');
    expect(message1).toEqual('should be string');

    data.data.private_info = '';
    const valid2 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.data.private_info');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if data.transaction is not valid', () => {
    const data = { data: { private_info } };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.data');
    expect(message).toEqual('should have required property \'transaction\'');

    data.data.transaction = 123;
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.data.transaction');
    expect(message1).toEqual('should be object');
  });

  it('should validate failed if data.transaction.originator_vasp_code is not valid', () => {
    const data = { data: { private_info, transaction: {} } };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.data.transaction');
    expect(message).toEqual('should have required property \'originator_vasp_code\'');

    data.data.transaction.originator_vasp_code = 123;
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.data.transaction.originator_vasp_code');
    expect(message1).toEqual('should be string');

    data.data.transaction.originator_vasp_code = '';
    const valid2 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.data.transaction.originator_vasp_code');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if data.transaction.originator_addrs is not valid', () => {
    const data = {
      data: {
        private_info, transaction: {
          originator_vasp_code: "123"
        }
      }
    };

    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.data.transaction');
    expect(message).toEqual('should have required property \'originator_addrs\'');

    data.data.transaction.originator_addrs = 123;
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.data.transaction.originator_addrs');
    expect(message1).toEqual('should be array');

    data.data.transaction.originator_addrs = [];
    const valid2 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.data.transaction.originator_addrs');
    expect(message2).toEqual('should NOT have fewer than 1 items');

    data.data.transaction.originator_addrs[0] = 123;
    const valid3 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.data.transaction.originator_addrs[0]');
    expect(message3).toEqual('should be string');

    data.data.transaction.originator_addrs[0] = '';
    const valid4 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.data.transaction.originator_addrs[0]');
    expect(message4).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if data.transaction.beneficiary_vasp_code is not valid', () => {
    const data = {
      data: {
        private_info,
        transaction: {
          originator_vasp_code: "123",
          originator_addrs: ['123']
        }
      }
    };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.data.transaction');
    expect(message).toEqual('should have required property \'beneficiary_vasp_code\'');

    data.data.transaction.beneficiary_vasp_code = 123;
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.data.transaction.beneficiary_vasp_code');
    expect(message1).toEqual('should be string');

    data.data.transaction.beneficiary_vasp_code = '';
    const valid2 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.data.transaction.beneficiary_vasp_code');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if data.transaction.beneficiary_addrs is not valid', () => {
    const data = {
      data: {
        private_info,
        transaction: {
          originator_vasp_code: "123",
          originator_addrs: ['123'],
          beneficiary_vasp_code: "123"
        }
      }
    };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.data.transaction');
    expect(message).toEqual('should have required property \'beneficiary_addrs\'');

    data.data.transaction.beneficiary_addrs = 123;
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.data.transaction.beneficiary_addrs');
    expect(message1).toEqual('should be array');

    data.data.transaction.beneficiary_addrs = [];
    const valid2 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.data.transaction.beneficiary_addrs');
    expect(message2).toEqual('should NOT have fewer than 1 items');

    data.data.transaction.beneficiary_addrs[0] = 123;
    const valid3 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.data.transaction.beneficiary_addrs[0]');
    expect(message3).toEqual('should be string');

    data.data.transaction.beneficiary_addrs[0] = '';
    const valid4 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.data.transaction.beneficiary_addrs[0]');
    expect(message4).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if data.transaction.transaction_currency is not valid', () => {
    const data = {
      data: {
        private_info: "private_info",
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: "123",
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123']
        }
      }
    };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.data.transaction');
    expect(message).toEqual('should have required property \'transaction_currency\'');

    data.data.transaction.transaction_currency = 123;
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.data.transaction.transaction_currency');
    expect(message1).toEqual('should be string');

    data.data.transaction.transaction_currency = '';
    const valid2 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.data.transaction.transaction_currency');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if data.transaction.amount is not valid', () => {
    const data = {
      data: {
        private_info: "private_info",
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: "123",
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          transaction_currency: "123"
        }
      }
    };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.data.transaction');
    expect(message).toEqual('should have required property \'amount\'');

    data.data.transaction.amount = "123";
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.data.transaction.amount');
    expect(message1).toEqual('should be number');

    data.data.transaction.amount = 0;
    const valid2 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.data.transaction.amount');
    expect(message2).toEqual('should be > 0');
  });

  it('should validate failed if data.transaction.originator_addrs_extra is not valid', () => {
    const data = {
      data: {
        private_info: "private_info",
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: "123",
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          transaction_currency: "123",
          amount: 123,
          originator_addrs_extra: 123
        }
      }
    };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.data.transaction.originator_addrs_extra');
    expect(message).toEqual('should be object');

    data.data.transaction.originator_addrs_extra = {};
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.data.transaction.originator_addrs_extra');
    expect(message1).toEqual('should NOT have fewer than 1 properties');
  });

  it('should validate failed if data.transaction.beneficiary_addrs_extra is not valid', () => {
    const data = {
      data: {
        private_info: "private_info",
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: "123",
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          transaction_currency: "123",
          amount: 123,
          originator_addrs_extra: { DT: '001' },
          beneficiary_addrs_extra: 123
        }
      }
    };

    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.data.transaction.beneficiary_addrs_extra');
    expect(message).toEqual('should be object');

    data.data.transaction.beneficiary_addrs_extra = {};
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.data.transaction.beneficiary_addrs_extra');
    expect(message1).toEqual('should NOT have fewer than 1 properties');
  });

  it('should validate failed if data.data_dt is not valid', () => {
    const data = {
      data: {
        private_info,
        transaction
      }
    };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.data');
    expect(message).toEqual('should have required property \'data_dt\'');

    data.data.data_dt = "2019";
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.data.data_dt');
    expect(message1).toEqual('should match format \"date-time\"');

    data.data.data_dt = '';
    const valid2 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.data.data_dt');
    expect(message2).toEqual('should match format \"date-time\"');
  });

  it('should validate failed if data.signature is not valid', () => {
    const data = {
      data: {
        private_info,
        transaction,
        data_dt
      }
    };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.data');
    expect(message).toEqual('should have required property \'signature\'');

    data.data.signature = 0;
    const valid2 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.data.signature');
    expect(message2).toEqual('should be string');

    data.data.signature = '';
    const valid3 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.data.signature');
    expect(message3).toEqual('should NOT be shorter than 128 characters');

    data.data.signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid4 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.data.signature');
    expect(message4).toEqual('should NOT be longer than 128 characters');

    data.data.signature = '6b86b273ff34fce19d6b804egg5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const valid5 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid5[0]).toBe(false);
    const { dataPath: dataPath5, message: message5 } = valid5[1][0];
    expect(dataPath5).toEqual('.data.signature');
    expect(message5).toEqual('should match pattern \"^[0123456789A-Fa-f]+$\"');

  });

  it('should validate failed if data.expire_date is not valid', () => {
    const data = {
      data: {
        private_info,
        transaction,
        data_dt,
        signature,
        expire_date: "123"
      }
    };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.data.expire_date');
    expect(message).toEqual('should be number');

    data.data.expire_date = -1;
    const valid2 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.data.expire_date');
    expect(message2).toEqual('should be >= 0');
  });

  it('should validate failed if callback is not valid', () => {
    const data = {
      data: {
        private_info,
        transaction,
        data_dt,
        signature,
        expire_date: 123
      }
    };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'callback\'');

    data.callback = 123;
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.callback');
    expect(message1).toEqual('should be object');
  });

  it('should validate failed if callback.callback_url is not valid', () => {
    const data = {
      data: {
        private_info,
        transaction,
        data_dt,
        signature,
        expire_date: 123
      },
      callback: {

      }
    };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.callback');
    expect(message).toEqual('should have required property \'callback_url\'');

    data.callback.callback_url = 123;
    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.callback.callback_url');
    expect(message1).toEqual('should be string');

    data.callback.callback_url = 'abcde';
    const valid2 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.callback.callback_url');
    expect(message2).toEqual('should match format \"uri\"');
  });

  it('should validate failed if callback.signature is not valid', () => {
    const data = {
      data: {
        private_info,
        transaction,
        data_dt,
        signature,
        expire_date: 123
      },
      callback: {
        callback_url
      }
    };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.callback');
    expect(message).toEqual('should have required property \'signature\'');

    data.callback.signature = 0;
    const valid2 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.callback.signature');
    expect(message2).toEqual('should be string');

    data.callback.signature = '';
    const valid3 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.callback.signature');
    expect(message3).toEqual('should NOT be shorter than 128 characters');

    data.callback.signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid4 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.callback.signature');
    expect(message4).toEqual('should NOT be longer than 128 characters');

    data.callback.signature = '6b86b273ff34fce19d6b804egg5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const valid5 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid5[0]).toBe(false);
    const { dataPath: dataPath5, message: message5 } = valid5[1][0];
    expect(dataPath5).toEqual('.callback.signature');
    expect(message5).toEqual('should match pattern \"^[0123456789A-Fa-f]+$\"');

  });

  it('should validate success', () => {
    const data = {
      data: {
        private_info,
        transaction,
        data_dt,
        signature
      },
      callback: {
        callback_url,
        signature
      }
    };
    const valid = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid[0]).toBe(true);

    data.data.transaction.originator_addrs_extra = { DT: '001' };
    data.data.transaction.beneficiary_addrs_extra = { DT: '002' };

    const valid1 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid1[0]).toBe(true);

    data.data.expire_date = expire_date;
    const valid2 = validatePostPermissionRequestSchema(data, post_permission_request_schema);
    expect(valid2[0]).toBe(true);

  });
});