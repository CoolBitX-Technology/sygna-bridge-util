const Ajv = require('ajv');
const { validateExpireDate } = require('../../src/utils/validateExpireDate');
const { genPermissionSchema } = require('../../src/schema/data/permission');
const {
  genPostPermissionSchema,
} = require('../../src/schema/api_input/post_permission');

const fakeValidatedExpireDateResult = 'validated expire_date';
jest.mock('../../src/utils/validateExpireDate', () => ({
  validateExpireDate: jest.fn().mockReturnValue('validated expire_date'),
}));

jest.mock('../../src/schema/data/permission', () => ({
  genPermissionSchema: jest
    .fn()
    .mockImplementation((paramObj) => 'permission_schema'),
}));

jest.mock('../../src/schema/api_input/post_permission', () => ({
  genPostPermissionSchema: jest
    .fn()
    .mockImplementation((paramObj) => 'post_permission_schema'),
}));

describe('test validateSchema', () => {
  const fakeValidatedResult = 'validated';
  const fakeData = {
    callback_url: 'https://api.sygna.io/api/v1.1.0/bridge/',
    signature: 'abc',
    permission_status: 'abc',
  };

  let validateSchemaModulbe;
  jest.isolateModules(() => {
    validateSchemaModulbe = require('../../src/utils/validateSchema');
  });
  const validateSchema = (validateSchemaModulbe.validateSchema = jest
    .fn()
    .mockReturnValue(fakeValidatedResult));

  beforeEach(() => {
    validateSchema.mockClear();
    validateExpireDate.mockClear();
    genPermissionSchema.mockClear();
  });

  describe('test validateSchema', () => {
    const validateSchemaModulbe = require('../../src/utils/validateSchema');
    const { validateSchema } = validateSchemaModulbe;
    const restoreValidate = Ajv.prototype.validate;
    const restoreErrors = Ajv.prototype.errors;

    const schemaKeyRef = {
      type: 'object',
      properties: {
        callback_url: {
          type: 'string',
          format: 'uri',
        },
        signature: {
          type: 'string',
          minLength: 3,
          maxLength: 3,
          pattern: '^[0123456789A-Fa-f]+$',
        },
      },
      required: ['callback_url', 'signature'],
      additionalProperties: false,
    };

    beforeEach(() => {
      Ajv.prototype.validate = restoreValidate;
      Ajv.prototype.errors = restoreErrors;
    });

    it('should validate be called with correct parameters if validateSchema is called', () => {
      const validate = (Ajv.prototype.validate = jest.fn());

      const data = {
        callback_url: 'https://api.sygna.io/api/v1.1.0/bridge/',
        signature: 'abc',
      };
      const valid = validateSchema(data, schemaKeyRef);
      expect(validate.mock.calls.length).toBe(1);
      expect(validate.mock.calls[0][0]).toEqual(schemaKeyRef);
      expect(validate.mock.calls[0][1]).toEqual(data);

      data.callback_url = 'https://stackoverflow.com/';
      data.signature = 'def';
      const valid1 = validateSchema(data, schemaKeyRef);
      expect(validate.mock.calls.length).toBe(2);
      expect(validate.mock.calls[1][0]).toEqual(schemaKeyRef);
      expect(validate.mock.calls[1][1]).toEqual(data);
    });

    it('should return correct value after validated', () => {
      const fakeError = [
        {
          keyword: 'type',
          dataPath: '.reject_message',
          schemaPath: '#/properties/reject_message/type',
          params: { type: 'string' },
          message: 'should be string',
        },
      ];
      const validate = (Ajv.prototype.validate = jest
        .fn()
        .mockReturnValueOnce(true)
        .mockReturnValue(false));
      Ajv.prototype.errors = fakeError;

      const data = {
        callback_url: 'https://api.sygna.io/api/v1.1.0/bridge/',
        signature: 'abc',
      };
      const valid = validateSchema(data, schemaKeyRef);
      expect(valid).toEqual([true]);

      const valid1 = validateSchema(data, schemaKeyRef);
      expect(valid1).toEqual([false, fakeError]);
    });
  });

  describe('test validateCallbackSchema', () => {
    const schema = require('../../src/schema/data/callback.json');
    const { validateCallbackSchema } = validateSchemaModulbe;
    it('should validateSchema be called with correct parameters if validateCallbackSchema is called', () => {
      const valid = validateCallbackSchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(valid).toEqual(fakeValidatedResult);
    });
  });

  describe('test validateTxIdSchema', () => {
    const schema = require('../../src/schema/data/txid.json');
    const { validateTxIdSchema } = validateSchemaModulbe;
    it('should validateSchema be called with correct parameters if validateTxIdSchema is called', () => {
      const valid = validateTxIdSchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(valid).toEqual(fakeValidatedResult);
    });
  });

  describe('test validatePermissionSchema', () => {
    const { validatePermissionSchema } = validateSchemaModulbe;
    const fakeData = {
      transfer_id:
        '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      permission_status: 'REJECTED',
      reject_code: 'BVRC001',
      reject_message: 'unsupported_currency',
    };
    const fakeDataWithExpireDate = {
      ...fakeData,
    };
    fakeDataWithExpireDate.expire_date = 1582255065000;
    it('should validateSchema,validateExpireDate and genPermissionSchema be called with correct parameters if validatePermissionSchema is called', () => {
      const valid = validatePermissionSchema(fakeData);
      expect(genPermissionSchema.mock.calls.length).toEqual(1);
      expect(genPermissionSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual('permission_schema');
      expect(validateExpireDate.mock.calls.length).toEqual(1);
      expect(validateExpireDate.mock.calls[0][0]).toEqual(undefined);
      expect(valid).toEqual(fakeValidatedExpireDateResult);

      const valid1 = validatePermissionSchema(fakeDataWithExpireDate);
      expect(genPermissionSchema.mock.calls.length).toEqual(2);
      expect(genPermissionSchema.mock.calls[1][0]).toEqual(
        fakeDataWithExpireDate,
      );
      expect(validateSchema.mock.calls.length).toEqual(2);
      expect(validateSchema.mock.calls[1][0]).toEqual(fakeDataWithExpireDate);
      expect(validateSchema.mock.calls[1][1]).toEqual('permission_schema');
      expect(validateExpireDate.mock.calls.length).toEqual(2);
      expect(validateExpireDate.mock.calls[1][0]).toEqual(
        fakeDataWithExpireDate.expire_date,
      );
      expect(valid1).toEqual(fakeValidatedExpireDateResult);
    });
  });

  describe('test validatePermissionRequestSchema', () => {
    const schema = require('../../src/schema/data/permission_request.json');
    const { validatePermissionRequestSchema } = validateSchemaModulbe;
    const fakeData = {
      private_info: '12345',
      transaction: {
        originator_vasp_code: 'ABCDE',
        originator_addrs: ['1234567890'],
        originator_addrs_extra: { DT: '001' },
        beneficiary_vasp_code: 'XYZ01',
        beneficiary_addrs: ['0987654321'],
        beneficiary_addrs_extra: { DT: '002' },
        transaction_currency: '0x80000000',
        amount: '1',
      },
      data_dt: '2019-07-29T06:29:00.123Z',
    };
    const fakeDataWithExpireDate = {
      ...fakeData,
    };
    fakeDataWithExpireDate.expire_date = 1582255065000;
    it('should validateSchema and validateExpireDate be called with correct parameters if validatePermissionRequestSchema is called', () => {
      const valid = validatePermissionRequestSchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(validateExpireDate.mock.calls.length).toEqual(1);
      expect(validateExpireDate.mock.calls[0][0]).toEqual(undefined);
      expect(valid).toEqual(fakeValidatedExpireDateResult);

      const valid1 = validatePermissionRequestSchema(fakeDataWithExpireDate);
      expect(validateSchema.mock.calls.length).toEqual(2);
      expect(validateSchema.mock.calls[1][0]).toEqual(fakeDataWithExpireDate);
      expect(validateSchema.mock.calls[1][1]).toEqual(schema);
      expect(validateExpireDate.mock.calls.length).toEqual(2);
      expect(validateExpireDate.mock.calls[1][0]).toEqual(
        fakeDataWithExpireDate.expire_date,
      );
      expect(valid1).toEqual(fakeValidatedExpireDateResult);
    });
  });

  describe('test validatePostPermissionSchema', () => {
    const {
      genPostPermissionSchema,
    } = require('../../src/schema/api_input/post_permission');
    const { validatePostPermissionSchema } = validateSchemaModulbe;
    const fakeData = {
      transfer_id:
        '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
      permission_status: 'REJECTED',
      reject_code: 'BVRC001',
      reject_message: 'unsupported_currency',
      signature: '12345',
    };
    const fakeDataWithExpireDate = {
      ...fakeData,
    };
    fakeDataWithExpireDate.expire_date = 1582255065000;
    it('should validateSchema,validateExpireDate and genPostPermissionSchema be called with correct parameters if validatePostPermissionSchema is called', () => {
      const valid = validatePostPermissionSchema(fakeData);
      expect(genPostPermissionSchema.mock.calls.length).toEqual(1);
      expect(genPostPermissionSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual('post_permission_schema');
      expect(validateExpireDate.mock.calls.length).toEqual(1);
      expect(validateExpireDate.mock.calls[0][0]).toEqual(undefined);
      expect(valid).toEqual(fakeValidatedExpireDateResult);

      const valid1 = validatePostPermissionSchema(fakeDataWithExpireDate);
      expect(genPostPermissionSchema.mock.calls.length).toEqual(2);
      expect(genPostPermissionSchema.mock.calls[1][0]).toEqual(
        fakeDataWithExpireDate,
      );
      expect(validateSchema.mock.calls.length).toEqual(2);
      expect(validateSchema.mock.calls[1][0]).toEqual(fakeDataWithExpireDate);
      expect(validateSchema.mock.calls[1][1]).toEqual('post_permission_schema');
      expect(validateExpireDate.mock.calls.length).toEqual(2);
      expect(validateExpireDate.mock.calls[1][0]).toEqual(
        fakeDataWithExpireDate.expire_date,
      );
      expect(valid1).toEqual(fakeValidatedExpireDateResult);
    });
  });

  describe('test validatePostPermissionRequestSchema', () => {
    const schema = require('../../src/schema/api_input/post_permission_request.json');
    const { validatePostPermissionRequestSchema } = validateSchemaModulbe;
    const fakeData = {
      data: {
        private_info: '12345',
        transaction: {
          originator_vasp_code: 'ABCDE',
          originator_addrs: ['1234567890'],
          originator_addrs_extra: { DT: '001' },
          beneficiary_vasp_code: 'XYZ12',
          beneficiary_addrs: ['0987654321'],
          beneficiary_addrs_extra: { DT: '002' },
          transaction_currency: '0x80000000',
          amount: '1',
        },
        data_dt: '2019-07-29T06:29:00.123Z',
        signature: '12345',
      },
      callback: {
        callback_url: 'https://api.sygna.io/api/v1.1.0/bridge/',
        signature: '12345',
      },
    };
    const fakeDataWithExpireDate = {
      ...fakeData,
    };
    fakeDataWithExpireDate.data = {
      ...fakeData.data,
    };
    fakeDataWithExpireDate.data.expire_date = 1582255065000;
    it('should validateSchema and validateExpireDate be called with correct parameters if validatePostPermissionRequestSchema is called', () => {
      const valid = validatePostPermissionRequestSchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(validateExpireDate.mock.calls.length).toEqual(1);
      expect(validateExpireDate.mock.calls[0][0]).toEqual(undefined);
      expect(valid).toEqual(fakeValidatedExpireDateResult);

      const valid1 = validatePostPermissionRequestSchema(
        fakeDataWithExpireDate,
      );
      expect(validateSchema.mock.calls.length).toEqual(2);
      expect(validateSchema.mock.calls[1][0]).toEqual(fakeDataWithExpireDate);
      expect(validateSchema.mock.calls[1][1]).toEqual(schema);
      expect(validateExpireDate.mock.calls.length).toEqual(2);
      expect(validateExpireDate.mock.calls[1][0]).toEqual(
        fakeDataWithExpireDate.data.expire_date,
      );
      expect(valid1).toEqual(fakeValidatedExpireDateResult);
    });
  });

  describe('test validatePostRetrySchema', () => {
    const schema = require('../../src/schema/api_input/post_retry.json');
    const { validatePostRetrySchema } = validateSchemaModulbe;
    it('should validateSchema be called with correct parameters if validatePostRetrySchema is called', () => {
      const valid = validatePostRetrySchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(valid).toEqual(fakeValidatedResult);
    });
  });

  describe('test validatePostTxIdSchema', () => {
    const schema = require('../../src/schema/api_input/post_txid.json');
    const { validatePostTxIdSchema } = validateSchemaModulbe;
    it('should validateSchema be called with correct parameters if validatePostTxIdSchema is called', () => {
      const valid = validatePostTxIdSchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(valid).toEqual(fakeValidatedResult);
    });
  });

  describe('test validateGetTransferStatusSchema', () => {
    const schema = require('../../src/schema/api_input/get_transfer_status.json');
    const { validateGetTransferStatusSchema } = validateSchemaModulbe;
    it('should validateSchema be called with correct parameters if validateGetTransferStatusSchema is called', () => {
      const valid = validateGetTransferStatusSchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(valid).toEqual(fakeValidatedResult);
    });
  });

  describe('test validateResGetTransferStatusSchema', () => {
    const schema = require('../../src/schema/api_response/res_get_transfer_status.json');
    const { validateResGetTransferStatusSchema } = validateSchemaModulbe;
    it('should validateSchema be called with correct parameters if validateResGetTransferStatusSchema is called', () => {
      const valid = validateResGetTransferStatusSchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(valid).toEqual(fakeValidatedResult);
    });
  });

  describe('test validateResGetVaspSchema', () => {
    const schema = require('../../src/schema/api_response/res_get_vasp.json');
    const { validateResGetVaspSchema } = validateSchemaModulbe;
    it('should validateSchema be called with correct parameters if validateResGetVaspSchema is called', () => {
      const valid = validateResGetVaspSchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(valid).toEqual(fakeValidatedResult);
    });
  });

  describe('test validateResOkSchema', () => {
    const schema = require('../../src/schema/api_response/res_ok.json');
    const { validateResOkSchema } = validateSchemaModulbe;
    it('should validateSchema be called with correct parameters if validateResOkSchema is called', () => {
      const valid = validateResOkSchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(valid).toEqual(fakeValidatedResult);
    });
  });

  describe('test validateResPostPermissionRequestSchema', () => {
    const schema = require('../../src/schema/api_response/res_post_permission_request.json');
    const { validateResPostPermissionRequestSchema } = validateSchemaModulbe;
    it('should validateSchema be called with correct parameters if validateResPostPermissionRequestSchema is called', () => {
      const valid = validateResPostPermissionRequestSchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(valid).toEqual(fakeValidatedResult);
    });
  });

  describe('test validateResRetrySchema', () => {
    const schema = require('../../src/schema/api_response/res_retry.json');
    const { validateResRetrySchema } = validateSchemaModulbe;
    it('should validateSchema be called with correct parameters if validateResRetrySchema is called', () => {
      const valid = validateResRetrySchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(valid).toEqual(fakeValidatedResult);
    });
  });

  describe('test validateBeneficiaryEndpointUrlSchema', () => {
    const schema = require('../../src/schema/data/beneficiary_endpoint_url.json');
    const { validateBeneficiaryEndpointUrlSchema } = validateSchemaModulbe;
    it('should validateSchema be called with correct parameters if validateBeneficiaryEndpointUrlSchema is called', () => {
      const valid = validateBeneficiaryEndpointUrlSchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(valid).toEqual(fakeValidatedResult);
    });
  });

  describe('test validatePostBeneficiaryEndpointUrlSchema', () => {
    const schema = require('../../src/schema/api_input/post_beneficiary_endpoint_url.json');
    const { validatePostBeneficiaryEndpointUrlSchema } = validateSchemaModulbe;
    it('should validateSchema be called with correct parameters if validatePostBeneficiaryEndpointUrlSchema is called', () => {
      const valid = validatePostBeneficiaryEndpointUrlSchema(fakeData);
      expect(validateSchema.mock.calls.length).toEqual(1);
      expect(validateSchema.mock.calls[0][0]).toEqual(fakeData);
      expect(validateSchema.mock.calls[0][1]).toEqual(schema);
      expect(valid).toEqual(fakeValidatedResult);
    });
  });
});
