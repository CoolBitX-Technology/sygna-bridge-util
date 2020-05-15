const { EXPIRE_DATE_MIN_OFFSET } = require('../config');

function validateExpireDate(expire_date) {
  if (!expire_date && expire_date !== 0)
    return [true];

  if (typeof expire_date !== 'number') {
    return [
      false, [
        {
          "keyword": "type",
          "dataPath": ".expire_date",
          "schemaPath": "#/properties/expire_date/type",
          "params": { "type": "number" },
          "message": `should be number`
        }
      ]
    ];
  }

  const today = new Date();
  const valid = ((expire_date - today.getTime()) >= EXPIRE_DATE_MIN_OFFSET);
  if (!valid) {
    return [
      false, [
        {
          "keyword": "minimum",
          "dataPath": ".expire_date",
          "schemaPath": "#/properties/expire_date/minimum",
          "params": { "comparison": ">=", "limit": (EXPIRE_DATE_MIN_OFFSET / 1000), "exclusive": false },
          "message": `expire_date should be at least ${EXPIRE_DATE_MIN_OFFSET / 1000} seconds away from the current time.`
        }
      ]
    ];
  } else {
    return [true];
  }
}

exports.validateExpireDate = validateExpireDate;