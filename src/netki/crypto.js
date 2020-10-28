const { pki } = require("node-forge");
const crypto = require("crypto");

exports.rsaKeyPairGen = () =>
  new Promise((res, rej) => {
    pki.rsa.generateKeyPair({ bits: 2048 }, (err, keypair) => {
      if (err) rej(err);
      res(keypair);
    });
  });

exports.signProtobufMessage = (protoMsg, privKeyPem) => {
  if (!protoMsg.setSignature) {
    throw Error("Cannot set signature");
  }

  protoMsg.setSignature(Buffer.from(""));
  // create message digest
  const sha256 = crypto.createHash("SHA256");
  sha256.update(protoMsg.serializeBinary());
  const hashhex = sha256.digest("hex");

  // sign message digest
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(Buffer.from(hashhex));
  const signature = sign.sign(privKeyPem, "base64");
  protoMsg.setSignature(Buffer.from(signature));

  return protoMsg;
};

exports.validateProtobufSignature = (protoMsg, publicKeyPem) => {
  if (!protoMsg.getSignature) {
    throw Error("Cannot get signature");
  }

  // get signature
  const rawSignature = protoMsg.getSignature();
  // signature to "ACTUAL" buffer
  const signature = Buffer.from(
    Buffer.from(rawSignature).toString("utf-8"),
    "base64"
  );

  // delete signature
  protoMsg.setSignature(Buffer.from(""));

  // get message hash
  const sha256 = crypto.createHash("SHA256");
  sha256.update(protoMsg.serializeBinary());
  const hashhex = sha256.digest("hex");

  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(Buffer.from(hashhex));
  return verifier.verify(publicKeyPem, signature);
};
