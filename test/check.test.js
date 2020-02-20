const {
  checkObjSigned,
  checkExpireDateValid
} = require('../src/api/check');
const { EXPIRE_DATE_MIN_OFFSET } = require('../src/config')

describe('test check', () => {
  describe('test checkObjSigned', () => {
    it('should throw error if signature is not valid', () => {
      expect(() => {
        checkObjSigned("123");
      }).toThrow(new Error(`Missing signature in Object`));

      expect(() => {
        checkObjSigned(123);
      }).toThrow(new Error(`Missing signature in Object`));

      expect(() => {
        checkObjSigned(
          { a: 1 }
        );
      }).toThrow(new Error(`Missing signature in Object`));

      expect(() => {
        checkObjSigned();
      }).toThrow(new Error(`Missing signature in Object`));

      expect(() => {
        checkObjSigned({
          signature: 123
        });
      }).toThrow(new Error(`Expect signature to be string, got number`));

      expect(() => {
        checkObjSigned({
          signature: { a: 1 }
        });
      }).toThrow(new Error(`Expect signature to be string, got object`));

      expect(() => {
        checkObjSigned({
          signature: "123"
        });
      }).toThrow(new Error(`Expect signature length to be 128.`));

      expect(() => {
        checkObjSigned({
          signature: "359f313230b12e3bc00af64a5462026a4a29ff1be2fadf1c03012c7aec96f10ded5c37a27d38906345f2066ee3e6c94b323b5dec0f396333d7e116b8d81e8fc7"
        })
      }).not.toThrow()

    });
  });
  describe('test checkExpireDateValid', () => {
    it('should throw error if expire_date is not number', () => {
      expect(() => {
        checkExpireDateValid("123");
      }).toThrow(new Error(`Expect expire_date to be number, got string`));

      expect(() => {
        checkExpireDateValid(true);
      }).toThrow(new Error(`Expect expire_date to be number, got boolean`));

      expect(() => {
        checkExpireDateValid({ a: 1 });
      }).toThrow(new Error(`Expect expire_date to be number, got object`));
    });

    it('should throw error if expire_date is too short', () => {
      expect(() => {
        checkExpireDateValid(1582011631);//GMT: Tuesday, February 18, 2020 7:40:31 AM
      }).toThrow(new Error(`expire_date should be at least ${EXPIRE_DATE_MIN_OFFSET} seconds away from the current time.`));

      expect(() => {
        checkExpireDateValid(1582011631000);//GMT: Tuesday, February 18, 2020 7:40:31 AM
      }).toThrow(new Error(`expire_date should be at least ${EXPIRE_DATE_MIN_OFFSET} seconds away from the current time.`));

      expect(() => {
        checkExpireDateValid(4106604075);//GMT: Thursday, February 18, 2100 3:21:15 AM
      }).toThrow(new Error(`expire_date should be at least ${EXPIRE_DATE_MIN_OFFSET} seconds away from the current time.`));


      expect(function () {
        checkExpireDateValid();
        checkExpireDateValid(undefined);
        checkExpireDateValid(false);
        checkExpireDateValid(0);
        checkExpireDateValid(4106604075000);//GMT: Thursday, February 18, 2100 3:21:15 AM
      }).not.toThrow();

    });

  });

});