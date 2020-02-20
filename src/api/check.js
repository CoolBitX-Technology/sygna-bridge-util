const { EXPIRE_DATE_MIN_OFFSET } = require('../config')
/**
 * @param {{signature:string}} obj 
 * @return {void}
 */
function checkObjSigned(obj) {
    if (!obj || !obj.signature) throw new Error(`Missing signature in Object`);
    if (typeof obj.signature !== "string") throw new Error(`Expect signature to be string, got ${typeof obj.signature}`);
    if (obj.signature.length !== 128) throw new Error("Expect signature length to be 128.");
}

function checkExpireDateValid(expire_date) {
    if (!expire_date)
        return;

    if (typeof expire_date !== "number") throw new Error(`Expect expire_date to be number, got ${typeof expire_date}`);
    const date = new Date(expire_date)
    const today = new Date()
    if (date.getTime() - today.getTime() < EXPIRE_DATE_MIN_OFFSET) {
        throw new Error(`expire_date should be at least ${EXPIRE_DATE_MIN_OFFSET} seconds away from the current time.`);
    }
}

module.exports = {
    checkObjSigned,
    checkExpireDateValid
};