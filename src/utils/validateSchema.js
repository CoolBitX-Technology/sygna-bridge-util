const Ajv = require('ajv');

exports.validateSchema = (paramObj, schema) => {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, paramObj);
  if (!valid) {
    return [false, ajv.errors];
  } else {
    return [true];
  }
}
