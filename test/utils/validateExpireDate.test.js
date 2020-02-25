const { EXPIRE_DATE_MIN_OFFSET } = require('../../src/config')
const { validateExpireDate } = require('../../src/utils/validateExpireDate')

describe('test validateExpireDate', () => {
  it('should validate failed if expire_date is not number', () => {

    const valid = validateExpireDate("123");
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.expire_date');
    expect(message).toEqual('should be number');

    const valid1 = validateExpireDate({ a: 1 });
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.expire_date');
    expect(message1).toEqual('should be number');

  });

  it('should validate failed if expire_date is too short', () => {

    const valid = validateExpireDate(1582011631);//GMT: Tuesday, February 18, 2020 7:40:31 AM
    expect(valid[0]).toBe(false);
    const { dataPath, message } = valid[1][0];
    expect(dataPath).toEqual('.expire_date');
    expect(message).toEqual(`expire_date should be at least ${EXPIRE_DATE_MIN_OFFSET / 1000} seconds away from the current time.`);

    const valid1 = validateExpireDate(1582011631000);//GMT: Tuesday, February 18, 2020 7:40:31 AM
    expect(valid1[0]).toBe(false);
    const { dataPath: dataPath1, message: message1 } = valid1[1][0];
    expect(dataPath1).toEqual('.expire_date');
    expect(message1).toEqual(`expire_date should be at least ${EXPIRE_DATE_MIN_OFFSET / 1000} seconds away from the current time.`);

    const valid2 = validateExpireDate(4106604075);//GMT: Thursday, February 18, 2100 3:21:15 AM
    expect(valid2[0]).toBe(false);
    const { dataPath: dataPath2, message: message2 } = valid2[1][0];
    expect(dataPath2).toEqual('.expire_date');
    expect(message2).toEqual(`expire_date should be at least ${EXPIRE_DATE_MIN_OFFSET / 1000} seconds away from the current time.`);

    const valid3 = validateExpireDate(0);
    expect(valid3[0]).toBe(false);
    const { dataPath: dataPath3, message: message3 } = valid3[1][0];
    expect(dataPath3).toEqual('.expire_date');
    expect(message3).toEqual(`expire_date should be at least ${EXPIRE_DATE_MIN_OFFSET / 1000} seconds away from the current time.`);

  });

  it('should valdiate success', () => {
    const valid = validateExpireDate();
    expect(valid[0]).toBe(true);

    const valid1 = validateExpireDate(undefined);
    expect(valid1[0]).toBe(true);

    const valid2 = validateExpireDate(4106604075000);
    expect(valid2[0]).toBe(true);//GMT: Thursday, February 18, 2100 3:21:15 AM

  });

});