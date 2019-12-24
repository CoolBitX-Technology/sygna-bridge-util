/**
 * @param {{signature:string}} obj 
 * @return {void}
 */
function checkObjSigned (obj){
    if(!obj.signature) throw new Error(`Missing signature in Object`);
    if(typeof obj.signature !== "string") throw new Error(`Expect signature to be string, got ${typeof obj.signature}`);
    if(obj.signature.length !== 128 ) throw new Error("Expect signature length to be 128.");
}

module.exports = {
    checkObjSigned
};