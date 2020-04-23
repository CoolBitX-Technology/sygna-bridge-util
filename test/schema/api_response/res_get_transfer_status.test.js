const { ACCEPTED, REJECTED } = require('../../../src/config');
const {
  validateResGetTransferStatusSchema,
} = require('../../../src/utils/validateSchema');

describe('test validate res_get_transfer_status_schema', () => {
  const transfer_id =
    '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
  const private_info = 'private_info';
  const transaction = {
    originator_addrs: ['123'],
    originator_vasp_code: '123',
    originator_addrs_extra: { DT: '001' },
    beneficiary_vasp_code: '123',
    beneficiary_addrs: ['123'],
    beneficiary_addrs_extra: { DT: '002' },
    transaction_currency: '123',
    amount: '1',
  };
  const data_dt = '2019-07-29T06:29:00.123Z';
  const permission_request_data_signature =
    '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
  const permission_signature =
    '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
  const txid = '123';
  const txid_signature =
    '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
  const created_at = '123';
  const transfer_to_originator_time = '123';
  const signature =
    '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';

  it('should validate failed if transferData is not valid', () => {
    const data = {};
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property 'transferData'");

    data.transferData = '123';
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData');
    expect(message1).toEqual('should be object');

    data.transferData = '';
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData');
    expect(message2).toEqual('should be object');
  });

  it('should validate failed if transferData.transfer_id is not valid', () => {
    const data = {
      transferData: {},
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData');
    expect(message).toEqual("should have required property 'transfer_id'");

    data.transferData.transfer_id = '';
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.transfer_id');
    expect(message1).toEqual('should NOT be shorter than 64 characters');

    data.transferData.transfer_id =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.transfer_id');
    expect(message2).toEqual('should NOT be longer than 64 characters');
  });

  it('should validate failed if transferData.private_info is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData');
    expect(message).toEqual("should have required property 'private_info'");

    data.transferData.private_info = 123;
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.private_info');
    expect(message1).toEqual('should be string,null');

    data.transferData.private_info = '';
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.private_info');
    expect(message2).toEqual('should NOT be shorter than 1 characters');

    data.transferData.private_info = null;
    const valid3 = validateResGetTransferStatusSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).not.toBe('.transferData.private_info');
  });

  it('should validate failed if transferData.transaction is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info: null,
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData');
    expect(message).toEqual("should have required property 'transaction'");

    data.transferData.transaction = '';
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.transaction');
    expect(message1).toEqual('should be object,null');

    data.transferData.transaction = null;
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).not.toBe('.transferData.transaction');
  });

  it('should validate failed if transferData.transaction.originator_vasp_code is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction: {},
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData.transaction');
    expect(message).toEqual(
      "should have required property 'originator_vasp_code'",
    );

    data.transferData.transaction.originator_vasp_code = 123;
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.transaction.originator_vasp_code');
    expect(message1).toEqual('should be string');

    data.transferData.transaction.originator_vasp_code = '';
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.transaction.originator_vasp_code');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if transferData.transaction.originator_addrs is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction: {
          originator_vasp_code: '123',
        },
      },
    };

    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData.transaction');
    expect(message).toEqual("should have required property 'originator_addrs'");

    data.transferData.transaction.originator_addrs = 123;
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.transaction.originator_addrs');
    expect(message1).toEqual('should be array');

    data.transferData.transaction.originator_addrs = [];
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.transaction.originator_addrs');
    expect(message2).toEqual('should NOT have fewer than 1 items');

    data.transferData.transaction.originator_addrs[0] = 123;
    const valid3 = validateResGetTransferStatusSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.transferData.transaction.originator_addrs[0]');
    expect(message3).toEqual('should be string');

    data.transferData.transaction.originator_addrs[0] = '';
    const valid4 = validateResGetTransferStatusSchema(data);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.transferData.transaction.originator_addrs[0]');
    expect(message4).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if transferData.transaction.beneficiary_vasp_code is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction: {
          originator_vasp_code: '123',
          originator_addrs: ['123'],
        },
      },
    };

    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData.transaction');
    expect(message).toEqual(
      "should have required property 'beneficiary_vasp_code'",
    );

    data.transferData.transaction.beneficiary_vasp_code = 123;
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual(
      '.transferData.transaction.beneficiary_vasp_code',
    );
    expect(message1).toEqual('should be string');

    data.transferData.transaction.beneficiary_vasp_code = '';
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual(
      '.transferData.transaction.beneficiary_vasp_code',
    );
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if transferData.transaction.beneficiary_addrs is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction: {
          originator_vasp_code: '123',
          originator_addrs: ['123'],
          beneficiary_vasp_code: '123',
        },
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData.transaction');
    expect(message).toEqual(
      "should have required property 'beneficiary_addrs'",
    );

    data.transferData.transaction.beneficiary_addrs = 123;
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.transaction.beneficiary_addrs');
    expect(message1).toEqual('should be array');

    data.transferData.transaction.beneficiary_addrs = [];
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.transaction.beneficiary_addrs');
    expect(message2).toEqual('should NOT have fewer than 1 items');

    data.transferData.transaction.beneficiary_addrs[0] = 123;
    const valid3 = validateResGetTransferStatusSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.transferData.transaction.beneficiary_addrs[0]');
    expect(message3).toEqual('should be string');

    data.transferData.transaction.beneficiary_addrs[0] = '';
    const valid4 = validateResGetTransferStatusSchema(data);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.transferData.transaction.beneficiary_addrs[0]');
    expect(message4).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if transferData.transaction.transaction_currency is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info: 'private_info',
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: '123',
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
        },
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData.transaction');
    expect(message).toEqual(
      "should have required property 'transaction_currency'",
    );

    data.transferData.transaction.transaction_currency = 123;
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.transaction.transaction_currency');
    expect(message1).toEqual('should be string');

    data.transferData.transaction.transaction_currency = '';
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.transaction.transaction_currency');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if transferData.transaction.originator_addrs_extra is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info: 'private_info',
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: '123',
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          transaction_currency: '123',
          amount: '123',
          originator_addrs_extra: 123,
        },
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual(
      '.transferData.transaction.originator_addrs_extra',
    );
    expect(message).toEqual('should be object');

    data.transferData.transaction.originator_addrs_extra = {};
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual(
      '.transferData.transaction.originator_addrs_extra',
    );
    expect(message1).toEqual('should NOT have fewer than 1 properties');
  });

  it('should validate failed if transferData.transaction.beneficiary_addrs_extra is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: '123',
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          transaction_currency: '123',
          amount: '123',
          originator_addrs_extra: { DT: '001' },
          beneficiary_addrs_extra: 123,
        },
      },
    };

    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual(
      '.transferData.transaction.beneficiary_addrs_extra',
    );
    expect(message).toEqual('should be object');

    data.transferData.transaction.beneficiary_addrs_extra = {};
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual(
      '.transferData.transaction.beneficiary_addrs_extra',
    );
    expect(message1).toEqual('should NOT have fewer than 1 properties');
  });

  it('should validate failed if transferData.data_dt is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: '123',
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          transaction_currency: '123',
          amount: '123',
          originator_addrs_extra: { DT: '001' },
          beneficiary_addrs_extra: { DT: '002' },
        },
      },
    };

    data.transferData.data_dt = '2019';
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.data_dt');
    expect(message1).toEqual('should match format "date-time"');

    data.transferData.data_dt = '';
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.data_dt');
    expect(message2).toEqual('should match format "date-time"');
  });

  it('should validate failed if transferData.permission_request_data_signature is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction,
        data_dt,
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData');
    expect(message).toEqual(
      "should have required property 'permission_request_data_signature'",
    );

    data.transferData.permission_request_data_signature = 0;
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual(
      '.transferData.permission_request_data_signature',
    );
    expect(message2).toEqual('should be string,null');

    data.transferData.permission_request_data_signature = '';
    const valid3 = validateResGetTransferStatusSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual(
      '.transferData.permission_request_data_signature',
    );
    expect(message3).toEqual('should NOT be shorter than 128 characters');

    data.transferData.permission_request_data_signature =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid4 = validateResGetTransferStatusSchema(data);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual(
      '.transferData.permission_request_data_signature',
    );
    expect(message4).toEqual('should NOT be longer than 128 characters');

    data.transferData.permission_request_data_signature =
      '6b86b273ff34fce19d6b804egg5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const valid5 = validateResGetTransferStatusSchema(data);
    expect(valid5[0]).toBe(false);
    const { dataPath: dataPath5, message: message5 } = valid5[1][0];
    expect(dataPath5).toEqual(
      '.transferData.permission_request_data_signature',
    );
    expect(message5).toEqual('should match pattern "^[0123456789A-Fa-f]+$"');

    data.transferData.permission_request_data_signature = null;
    const valid6 = validateResGetTransferStatusSchema(data);
    expect(valid6[0]).toBe(false);
    const { dataPath: dataPath6, message: message6 } = valid6[1][0];
    expect(dataPath6).not.toBe(
      '.transferData.permission_request_data_signature',
    );
  });

  it('should validate failed if transferData.permission_status is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction,
        data_dt,
        permission_request_data_signature,
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData');
    expect(message).toEqual(
      "should have required property 'permission_status'",
    );

    data.transferData.permission_status = 123;
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.permission_status');
    expect(message1).toEqual('should be null');
    const { dataPath: dataPath1_1, message: message1_1 } = valid1[1][1];
    expect(dataPath1_1).toEqual('.transferData.permission_status');
    expect(message1_1).toEqual('should be string');
    const { dataPath: dataPath1_2, message: message1_2 } = valid1[1][2];
    expect(dataPath1_2).toEqual('.transferData.permission_status');
    expect(message1_2).toEqual('should match exactly one schema in oneOf');

    data.transferData.permission_status = '';
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.permission_status');
    expect(message2).toEqual('should be null');
    const { dataPath: dataPath2_1, message: message2_1 } = valid2[1][1];
    expect(dataPath2_1).toEqual('.transferData.permission_status');
    expect(message2_1).toEqual('should NOT be shorter than 1 characters');
    const { dataPath: dataPath2_2, message: message2_2 } = valid2[1][2];
    expect(dataPath2_2).toEqual('.transferData.permission_status');
    expect(message2_2).toEqual('should match exactly one schema in oneOf');

    data.transferData.permission_status = '123';
    const valid3 = validateResGetTransferStatusSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.transferData.permission_status');
    expect(message3).toEqual('should be null');
    const { dataPath: dataPath3_1, params, message: message3_1 } = valid3[1][1];
    expect(dataPath3_1).toEqual('.transferData.permission_status');
    expect(params.allowedValues).toEqual([ACCEPTED, REJECTED]);
    expect(message3_1).toEqual('should be equal to one of the allowed values');
    const { dataPath: dataPath3_2, message: message3_2 } = valid3[1][2];
    expect(dataPath3_2).toEqual('.transferData.permission_status');
    expect(message3_2).toEqual('should match exactly one schema in oneOf');
  });

  it('should validate failed if transferData.permission_signature is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction,
        data_dt,
        permission_request_data_signature,
        permission_status: ACCEPTED,
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData');
    expect(message).toEqual(
      "should have required property 'permission_signature'",
    );

    data.transferData.permission_signature = 0;
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.permission_signature');
    expect(message2).toEqual('should be string,null');

    data.transferData.permission_signature = '';
    const valid3 = validateResGetTransferStatusSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.transferData.permission_signature');
    expect(message3).toEqual('should NOT be shorter than 128 characters');

    data.transferData.permission_signature =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid4 = validateResGetTransferStatusSchema(data);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.transferData.permission_signature');
    expect(message4).toEqual('should NOT be longer than 128 characters');

    data.transferData.permission_signature =
      '6b86b273ff34fce19d6b804egg5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const valid5 = validateResGetTransferStatusSchema(data);
    expect(valid5[0]).toBe(false);
    const { dataPath: dataPath5, message: message5 } = valid5[1][0];
    expect(dataPath5).toEqual('.transferData.permission_signature');
    expect(message5).toEqual('should match pattern "^[0123456789A-Fa-f]+$"');

    data.transferData.permission_signature = null;
    const valid6 = validateResGetTransferStatusSchema(data);
    expect(valid6[0]).toBe(false);
    const { dataPath: dataPath6, message: message6 } = valid6[1][0];
    expect(dataPath6).not.toBe('.transferData.permission_signature');
  });

  it('should validate failed if transferData.txid is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction,
        data_dt,
        permission_request_data_signature,
        permission_status: ACCEPTED,
        permission_signature,
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData');
    expect(message).toEqual("should have required property 'txid'");

    data.transferData.txid = 123;
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.txid');
    expect(message1).toEqual('should be string,null');

    data.transferData.txid = '';
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.txid');
    expect(message2).toEqual('should NOT be shorter than 1 characters');

    data.transferData.txid = null;
    const valid3 = validateResGetTransferStatusSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3 } = valid3[1][0];
    expect(dataPath3).not.toBe('.transferData.transfer_id');
  });

  it('should validate failed if transferData.txid_signature is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction,
        data_dt,
        permission_request_data_signature,
        permission_status: ACCEPTED,
        permission_signature,
        txid,
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData');
    expect(message).toEqual("should have required property 'txid_signature'");

    data.transferData.txid_signature = 0;
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.txid_signature');
    expect(message2).toEqual('should be string,null');

    data.transferData.txid_signature = '';
    const valid3 = validateResGetTransferStatusSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.transferData.txid_signature');
    expect(message3).toEqual('should NOT be shorter than 128 characters');

    data.transferData.txid_signature =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid4 = validateResGetTransferStatusSchema(data);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.transferData.txid_signature');
    expect(message4).toEqual('should NOT be longer than 128 characters');

    data.transferData.txid_signature =
      '6b86b273ff34fce19d6b804egg5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const valid5 = validateResGetTransferStatusSchema(data);
    expect(valid5[0]).toBe(false);
    const { dataPath: dataPath5, message: message5 } = valid5[1][0];
    expect(dataPath5).toEqual('.transferData.txid_signature');
    expect(message5).toEqual('should match pattern "^[0123456789A-Fa-f]+$"');

    data.transferData.txid_signature = null;
    const valid6 = validateResGetTransferStatusSchema(data);
    expect(valid6[0]).toBe(false);
    const { dataPath: dataPath6, message: message6 } = valid6[1][0];
    expect(dataPath6).not.toBe('.transferData.txid_signature');
  });

  it('should validate failed if transferData.created_at is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction,
        data_dt,
        permission_request_data_signature,
        permission_status: ACCEPTED,
        permission_signature,
        txid,
        txid_signature,
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData');
    expect(message).toEqual("should have required property 'created_at'");

    data.transferData.created_at = 123;
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.created_at');
    expect(message1).toEqual('should be string,null');

    data.transferData.created_at = '';
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.created_at');
    expect(message2).toEqual('should NOT be shorter than 1 characters');

    data.transferData.created_at = null;
    const valid3 = validateResGetTransferStatusSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3 } = valid3[1][0];
    expect(dataPath3).not.toBe('.transferData.created_at');
  });

  it('should validate failed if transferData.transfer_to_originator_time is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction,
        data_dt,
        permission_request_data_signature,
        permission_status: ACCEPTED,
        permission_signature,
        txid,
        txid_signature,
        created_at,
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData');
    expect(message).toEqual(
      "should have required property 'transfer_to_originator_time'",
    );

    data.transferData.transfer_to_originator_time = 123;
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.transfer_to_originator_time');
    expect(message1).toEqual('should be string,null');

    data.transferData.transfer_to_originator_time = '';
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.transfer_to_originator_time');
    expect(message2).toEqual('should NOT be shorter than 1 characters');

    data.transferData.transfer_to_originator_time = null;
    const valid3 = validateResGetTransferStatusSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3 } = valid3[1][0];
    expect(dataPath3).not.toBe('.transferData.transfer_to_originator_time');
  });

  it('should validate failed if signature is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction,
        data_dt,
        permission_request_data_signature,
        permission_status: ACCEPTED,
        permission_signature,
        txid,
        txid_signature,
        created_at,
        transfer_to_originator_time,
      },
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual("should have required property 'signature'");

    data.signature = 0;
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.signature');
    expect(message2).toEqual('should be string');

    data.signature = '';
    const valid3 = validateResGetTransferStatusSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.signature');
    expect(message3).toEqual('should NOT be shorter than 128 characters');

    data.signature =
      '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid4 = validateResGetTransferStatusSchema(data);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.signature');
    expect(message4).toEqual('should NOT be longer than 128 characters');

    data.signature =
      '6b86b273ff34fce19d6b804egg5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const valid5 = validateResGetTransferStatusSchema(data);
    expect(valid5[0]).toBe(false);
    const { dataPath: dataPath5, message: message5 } = valid5[1][0];
    expect(dataPath5).toEqual('.signature');
    expect(message5).toEqual('should match pattern "^[0123456789A-Fa-f]+$"');
  });

  it('should validate failed if transferData.transaction.amount is not valid', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction: {
          originator_addrs: ['123'],
          originator_vasp_code: '123',
          originator_addrs_extra: { DT: '001' },
          beneficiary_vasp_code: '123',
          beneficiary_addrs: ['123'],
          beneficiary_addrs_extra: { DT: '002' },
          transaction_currency: '123',
        },
        data_dt,
        permission_request_data_signature,
        permission_status: ACCEPTED,
        permission_signature,
        txid,
        txid_signature,
        created_at,
        transfer_to_originator_time,
      },
      signature,
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData.transaction');
    expect(message).toEqual("should have required property 'amount'");

    data.transferData.transaction.amount = 123;
    const valid1 = validateResGetTransferStatusSchema(data);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.transaction.amount');
    expect(message1).toEqual('should be string');

    data.transferData.transaction.amount = '';
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.transaction.amount');
    expect(message2).toEqual('should NOT be shorter than 1 characters');

    data.transferData.transaction.amount = 'abc';
    const valid3 = validateResGetTransferStatusSchema(data);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.transferData.transaction.amount');
    expect(message3).toEqual('should be valid number');

    data.transferData.transaction.amount = '1.a';
    const valid4 = validateResGetTransferStatusSchema(data);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.transferData.transaction.amount');
    expect(message4).toEqual('should be valid number');

    data.transferData.transaction.amount = '0';
    const valid5 = validateResGetTransferStatusSchema(data);
    expect(valid5[0]).toBe(false);
    const { dataPath: dataPath5, message: message5 } = valid5[1][0];
    expect(dataPath5).toEqual('.transferData.transaction.amount');
    expect(message5).toEqual('should be > 0');

    data.transferData.transaction.amount = '-1';
    const valid6 = validateResGetTransferStatusSchema(data);
    expect(valid6[0]).toBe(false);
    const { dataPath: dataPath6, message: message6 } = valid6[1][0];
    expect(dataPath6).toEqual('.transferData.transaction.amount');
    expect(message6).toEqual('should be > 0');
  });

  it('should validate success', () => {
    const data = {
      transferData: {
        transfer_id,
        private_info,
        transaction,
        data_dt,
        permission_request_data_signature,
        permission_status: ACCEPTED,
        permission_signature,
        txid,
        txid_signature,
        created_at,
        transfer_to_originator_time,
      },
      signature,
    };
    const valid = validateResGetTransferStatusSchema(data);
    expect(valid[0]).toBe(true);

    data.transferData.private_info = null;
    const valid2 = validateResGetTransferStatusSchema(data);
    expect(valid2[0]).toBe(true);

    data.transferData.transaction = null;
    const valid3 = validateResGetTransferStatusSchema(data);
    expect(valid3[0]).toBe(true);

    data.transferData.data_dt = null;
    const valid4 = validateResGetTransferStatusSchema(data);
    expect(valid4[0]).toBe(true);

    data.transferData.permission_request_data_signature = null;
    const valid5 = validateResGetTransferStatusSchema(data);
    expect(valid5[0]).toBe(true);

    data.transferData.permission_status = null;
    const valid6 = validateResGetTransferStatusSchema(data);
    expect(valid6[0]).toBe(true);

    data.transferData.permission_signature = null;
    const valid7 = validateResGetTransferStatusSchema(data);
    expect(valid7[0]).toBe(true);

    data.transferData.txid = null;
    const valid8 = validateResGetTransferStatusSchema(data);
    expect(valid8[0]).toBe(true);

    data.transferData.txid_signature = null;
    const valid9 = validateResGetTransferStatusSchema(data);
    expect(valid9[0]).toBe(true);

    data.transferData.created_at = null;
    const valid10 = validateResGetTransferStatusSchema(data);
    expect(valid10[0]).toBe(true);

    data.transferData.transfer_to_originator_time = null;
    const valid11 = validateResGetTransferStatusSchema(data);
    expect(valid11[0]).toBe(true);
  });
});
