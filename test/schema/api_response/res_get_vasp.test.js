
const { validateResGetVaspSchema } = require('../../../src/utils/validateSchema');
const res_get_vasp_schema = require('../../../src/schema/api_response/res_get_vasp.json');

describe('test validate res_get_vasp', () => {
  const vasp_name = 'Tokyo';
  const vasp_code = 'VASPKRZZ888';
  const vasp_pubkey = "fffffff";
  const signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
  const timestamp = 1582271290359;

  it('should validate failed if vasp_data is not valid', () => {
    const data = {};

    const valid = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'vasp_data\'');

    data.vasp_data = 123;
    const valid1 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.vasp_data');
    expect(message1).toEqual('should be array');

    data.vasp_data = [];
    const valid2 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.vasp_data');
    expect(message2).toEqual('should NOT have fewer than 1 items');

    data.vasp_data[0] = 123;
    const valid3 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.vasp_data[0]');
    expect(message3).toEqual('should be object');

  });

  it('should validate failed if vasp_data.vasp_name is not valid', () => {
    const data = {
      vasp_data: [
        {

        }
      ]
    };

    const valid = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.vasp_data[0]');
    expect(message).toEqual('should have required property \'vasp_name\'');

    data.vasp_data[0].vasp_name = 123;
    const valid1 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.vasp_data[0].vasp_name');
    expect(message1).toEqual('should be string');

    data.vasp_data[0].vasp_name = '';
    const valid2 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.vasp_data[0].vasp_name');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if vasp_data.vasp_code is not valid', () => {
    const data = {
      vasp_data: [
        {
          vasp_name
        }
      ]
    };

    const valid = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.vasp_data[0]');
    expect(message).toEqual('should have required property \'vasp_code\'');

    data.vasp_data[0].vasp_code = 123;
    const valid1 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.vasp_data[0].vasp_code');
    expect(message1).toEqual('should be string');

    data.vasp_data[0].vasp_code = '';
    const valid2 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.vasp_data[0].vasp_code');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if vasp_data.vasp_pubkey is not valid', () => {
    const data = {
      vasp_data: [
        {
          vasp_name,
          vasp_code
        }
      ]
    };

    const valid = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.vasp_data[0]');
    expect(message).toEqual('should have required property \'vasp_pubkey\'');

    data.vasp_data[0].vasp_pubkey = 123;
    const valid1 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.vasp_data[0].vasp_pubkey');
    expect(message1).toEqual('should be string');

    data.vasp_data[0].vasp_pubkey = '';
    const valid2 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.vasp_data[0].vasp_pubkey');
    expect(message2).toEqual('should NOT be shorter than 1 characters');
  });

  it('should validate failed if signature is not valid', () => {
    const data = {
      vasp_data: [
        {
          vasp_name,
          vasp_code,
          vasp_pubkey
        }
      ]
    };
    const valid = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'signature\'');

    data.signature = 0;
    const valid2 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.signature');
    expect(message2).toEqual('should be string');

    data.signature = '';
    const valid3 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.signature');
    expect(message3).toEqual('should NOT be shorter than 128 characters');

    data.signature = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b1';
    const valid4 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.signature');
    expect(message4).toEqual('should NOT be longer than 128 characters');

    data.signature = '6b86b273ff34fce19d6b804egg5a3f5747ada4eaa22f1d49c01e52ddb7875b4b6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
    const valid5 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid5[0]).toBe(false);
    const { dataPath: dataPath5, message: message5 } = valid5[1][0];
    expect(dataPath5).toEqual('.signature');
    expect(message5).toEqual('should match pattern \"^[0123456789A-Fa-f]+$\"');

  });

  it('should validate failed if timestamp is not valid', () => {
    const data = {
      vasp_data: [
        {
          vasp_name,
          vasp_code,
          vasp_pubkey
        }
      ],
      signature
    };
    const valid = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('');
    expect(message).toEqual('should have required property \'timestamp\'');

    data.timestamp = '123';
    const valid2 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.timestamp');
    expect(message2).toEqual('should be number');

    data.timestamp = -1;
    const valid3 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.timestamp');
    expect(message3).toEqual('should be >= 0');

  });

  it('should validate success', () => {
    const data = {
      vasp_data: [
        {
          vasp_name,
          vasp_code,
          vasp_pubkey
        }
      ],
      signature,
      timestamp
    };
    const valid = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid[0]).toBe(true);

    data.vasp_data.push(
      {
        vasp_name: '123',
        vasp_code: '456',
        vasp_pubkey: 'abc'
      }
    );
    const valid1 = validateResGetVaspSchema(data, res_get_vasp_schema);
    expect(valid1[0]).toBe(true);
  });
});