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
    const mockDate = new Date(1583062235000) //Sunday, March 1, 2020 11:30:35 AM
    const spy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate)

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

    const valid4 = validateExpireDate(1583062395000);//GMT: Sunday, March 1, 2020 11:33:15 AM
    expect(valid4[0]).toBe(false);
    const { dataPath: dataPath4, message: message4 } = valid4[1][0];
    expect(dataPath4).toEqual('.expire_date');
    expect(message4).toEqual(`expire_date should be at least ${EXPIRE_DATE_MIN_OFFSET / 1000} seconds away from the current time.`);

    const valid5 = validateExpireDate(1583062414000);//GMT: Sunday, March 1, 2020 11:33:34 AM
    expect(valid5[0]).toBe(false);
    const { dataPath: dataPath5, message: message5 } = valid5[1][0];
    expect(dataPath5).toEqual('.expire_date');
    expect(message5).toEqual(`expire_date should be at least ${EXPIRE_DATE_MIN_OFFSET / 1000} seconds away from the current time.`);

    spy.mockRestore()
  });

  it('should valdiate success', () => {
    const mockDate = new Date(1583062235000) //Sunday, March 1, 2020 11:30:35 AM
    const spy = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate)

    const valid = validateExpireDate();
    expect(valid[0]).toBe(true);

    const valid1 = validateExpireDate(undefined);
    expect(valid1[0]).toBe(true);

    const valid2 = validateExpireDate(4106604075000);
    expect(valid2[0]).toBe(true);//GMT: Thursday, February 18, 2100 3:21:15 AM

    const valid3 = validateExpireDate(1583062415000);
    expect(valid3[0]).toBe(true);//Sunday, March 1, 2020 11:33:35 AM

    spy.mockRestore()

  });

});