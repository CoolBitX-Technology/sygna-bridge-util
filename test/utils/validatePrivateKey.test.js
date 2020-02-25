const { validatePrivateKey } = require('../../src/utils/validatePrivateKey')

describe('test validatePrivateKey', () => {
  it('should validate failed if privateKey is not valid', () => {
    expect(() => {
      validatePrivateKey(123);
    }).toThrow(new Error(`privateKey should be string, got number`));

    expect(() => {
      validatePrivateKey({ a: 1 });
    }).toThrow(new Error(`privateKey should be string, got object`));

    expect(() => {
      validatePrivateKey();
    }).toThrow(new Error(`privateKey should be string, got undefined`));

    expect(() => {
      validatePrivateKey('');
    }).toThrow(new Error(`privateKey should NOT be shorter than 1 characters`));

  });

  it('should valdiate success', () => {
    expect(() => {
      validatePrivateKey('123');
      validatePrivateKey('123456');
    }).not.toThrow();

  });

});