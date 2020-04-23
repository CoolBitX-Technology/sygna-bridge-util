const {
  validateTransactionAmount,
} = require('../../src/utils/validateTransactionAmount');

describe('test validateTransactionAmount', () => {
  it('should validate failed if amount is less than 0', () => {
    const valid = validateTransactionAmount('0');
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transaction.amount');
    expect(message).toEqual('should be > 0');

    const valid1 = validateTransactionAmount('0.000');
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transaction.amount');
    expect(message1).toEqual('should be > 0');

    const valid2 = validateTransactionAmount('-1');
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transaction.amount');
    expect(message2).toEqual('should be > 0');
  });

  it('should validate failed if amount is not valid number', () => {
    const valid = validateTransactionAmount('abc');
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transaction.amount');
    expect(message).toEqual('should be valid number');

    const valid1 = validateTransactionAmount('1.a');
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transaction.amount');
    expect(message1).toEqual('should be valid number');

    const valid2 = validateTransactionAmount('1...1');
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transaction.amount');
    expect(message2).toEqual('should be valid number');
  });

  it('should show correct path', () => {
    const valid = validateTransactionAmount(
      'abc',
      'transferData.transaction.amount',
    );
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.transferData.transaction.amount');
    expect(message).toEqual('should be valid number');

    const valid1 = validateTransactionAmount(
      '1.a',
      'transferData.transaction.amount',
    );
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.transferData.transaction.amount');
    expect(message1).toEqual('should be valid number');

    const valid2 = validateTransactionAmount(
      '1...1',
      'transferData.transaction.amount',
    );
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.transferData.transaction.amount');
    expect(message2).toEqual('should be valid number');
  });

  it('should valdiate success', () => {
    const valid = validateTransactionAmount('1.');
    expect(valid[0]).toBe(true);

    const valid1 = validateTransactionAmount('1.2445');
    expect(valid1[0]).toBe(true);

    const valid2 = validateTransactionAmount('18394839');
    expect(valid2[0]).toBe(true);

    const valid3 = validateTransactionAmount(
      '7548932759834275983278924378943275982',
    );
    expect(valid3[0]).toBe(true);
  });
});
