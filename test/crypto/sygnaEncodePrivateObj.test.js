const { FAKE_PRIVATE_KEY, FAKE_PUBLIC_KEY } = require('../fakeKeys');
const crypto = require('../../src/crypto');

describe('test sygnaEncodePrivateObj and sygnaDecodePrivateObj', () => {
  it('should decode encoded object to original object', () => {
    const fakeData = {
      originator: {
        name: 'Antoine Griezmann',
        date_of_birth: '1991-03-21',
      },
      beneficiary: {
        name: 'Leo Messi',
      },
    };
    const encodedPrivateData = crypto.sygnaEncodePrivateObj(
      fakeData,
      FAKE_PUBLIC_KEY,
    );
    const decodedPrivateData = crypto.sygnaDecodePrivateObj(
      encodedPrivateData,
      FAKE_PRIVATE_KEY,
    );
    expect(decodedPrivateData).toEqual(fakeData);
  });

  it('should decode encoded string to original string', () => {
    const fakeData = 'qwer';
    const encodedPrivateData = crypto.sygnaEncodePrivateObj(
      fakeData,
      FAKE_PUBLIC_KEY,
    );
    const decodedPrivateData = crypto.sygnaDecodePrivateObj(
      encodedPrivateData,
      FAKE_PRIVATE_KEY,
    );
    expect(decodedPrivateData).toEqual(fakeData);
  });
});
