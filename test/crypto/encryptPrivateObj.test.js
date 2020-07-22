const { FAKE_PRIVATE_KEY, FAKE_PUBLIC_KEY } = require('../fakeKeys');
const crypto = require('../../src/crypto');

describe('test encryptPrivateObj and decryptPrivateObj', () => {
  it('should decrypt encrypted object to original object', () => {
    const fakeData = {
      originator: {
        name: 'Antoine Griezmann',
        date_of_birth: '1991-03-21',
      },
      beneficiary: {
        name: 'Leo Messi',
      },
    };
    const encryptedPrivateData = crypto.encryptPrivateObj(
      fakeData,
      FAKE_PUBLIC_KEY,
    );
    const decryptedPrivateData = crypto.decryptPrivateObj(
      encryptedPrivateData,
      FAKE_PRIVATE_KEY,
    );
    expect(decryptedPrivateData).toEqual(fakeData);
  });

  it('should decrypt encrypted string to original string', () => {
    const fakeData = 'qwer';
    const encryptedPrivateData = crypto.encryptPrivateObj(
      fakeData,
      FAKE_PUBLIC_KEY,
    );
    const decryptedPrivateData = crypto.decryptPrivateObj(
      encryptedPrivateData,
      FAKE_PRIVATE_KEY,
    );
    expect(decryptedPrivateData).toEqual(fakeData);
  });
});
