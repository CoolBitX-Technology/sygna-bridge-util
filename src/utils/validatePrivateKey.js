exports.validatePrivateKey = (privateKey) => {
  if (typeof privateKey !== "string") {
    throw new Error(`privateKey should be string, got ${typeof privateKey}`);
  }
  if (privateKey.length == 0) {
    throw new Error(`privateKey should NOT be shorter than 1 characters`);
  }
}