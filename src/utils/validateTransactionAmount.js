function validateTransactionAmount(amount, path = 'transaction.amount') {
  const value = Number(amount);
  if (value <= 0) {
    return [
      false,
      [
        {
          keyword: 'exclusiveMinimum',
          dataPath: `.${path}`,
          schemaPath: `#/properties/${path.replace('.', '/')}/pattern`,
          params: { comparison: '>', limit: 0, exclusive: true },
          message: `should be > 0`,
        },
      ],
    ];
  }
  const valid = !Number.isNaN(value);
  if (!valid) {
    return [
      false,
      [
        {
          keyword: 'pattern',
          dataPath: `.${path}`,
          schemaPath: `#/properties/${path.replace('.', '/')}/pattern`,
          message: `should be valid number`,
        },
      ],
    ];
  } else {
    return [true];
  }
}

exports.validateTransactionAmount = validateTransactionAmount;
