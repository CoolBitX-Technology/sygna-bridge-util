const { EXPIRE_DATE_MIN_OFFSET, ACCEPTED, REJECTED } = require('../config');
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
        throw new Error(`expire_date should be at least ${EXPIRE_DATE_MIN_OFFSET / 1000} seconds away from the current time.`);
    }
}

function checkPermissionStatus(permission_status) {
    if (permission_status !== ACCEPTED && permission_status !== REJECTED) {
        throw new Error(`permission_status is either ${ACCEPTED} or ${REJECTED}`);
    }
}

function checkRejectDataValid(permission_status, reject_code, reject_message) {
    if (permission_status !== REJECTED)
        return;

    if (typeof reject_code !== "string") throw new Error(`Expect reject_code to be string, got ${typeof reject_code}`);
    if (typeof reject_message !== "string") throw new Error(`Expect reject_message to be string, got ${typeof reject_message}`);

    if (!reject_code) throw new Error(`reject_code cannot be blank`);
    if (!reject_message) throw new Error(`reject_message cannot be blank`);
}

module.exports = {
    checkObjSigned,
    checkExpireDateValid,
    checkPermissionStatus,
    checkRejectDataValid
};