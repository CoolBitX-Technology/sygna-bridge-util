const {
  checkExpireDateValid
} = require('../src/api/check');

describe('test check', () => {
  describe('test checkExpireDateValid', () => {
    it('should throw error if expire_date is not number', () => {
      try {
        checkExpireDateValid("123");
      } catch (error) {
        expect(error).toEqual(new Error(`Expect expire_date to be number, got string`))
      }

      try {
        checkExpireDateValid(true);
      } catch (error) {
        expect(error).toEqual(new Error(`Expect expire_date to be number, got boolean`))
      }

      try {
        checkExpireDateValid({a:1});
      } catch (error) {
        expect(error).toEqual(new Error(`Expect expire_date to be number, got object`))
      }
    });

    it('should throw error if expire_date is too short', () => {
      try {
        checkExpireDateValid(1582011631);//GMT: Tuesday, February 18, 2020 7:40:31 AM
      } catch (error) {
        expect(error).toEqual(new Error(`expire_date should be at least 60 seconds away from the current time.`))
      }

      try {
        checkExpireDateValid(1582011631000);//GMT: Tuesday, February 18, 2020 7:40:31 AM
      } catch (error) {
        expect(error).toEqual(new Error(`expire_date should be at least 60 seconds away from the current time.`))
      }

      try {
        checkExpireDateValid(4106604075);//GMT: Thursday, February 18, 2100 3:21:15 AM
      } catch (error) {
        expect(error).toEqual(new Error(`expire_date should be at least 60 seconds away from the current time.`))
      }

      expect(function() {
        checkExpireDateValid();
        checkExpireDateValid(undefined);
        checkExpireDateValid(false);
        checkExpireDateValid(0);
        checkExpireDateValid(4106604075000);//GMT: Thursday, February 18, 2100 3:21:15 AM
      }).not.toThrow();
  
    });
    
  });

});
