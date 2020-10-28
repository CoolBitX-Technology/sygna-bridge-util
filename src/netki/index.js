const {
  signProtobufMessage,
  validateProtobufSignature,
  rsaKeyPairGen,
} = require("./crypto");
const { attestationToPrinciple } = require("./attestation");
const {
  generateCertificate,
  attestationCertificateToOwnersData,
} = require("./certificate");

module.exports = {
  rsaKeyPairGen,
  signProtobufMessage,
  validateProtobufSignature,
  attestationToPrinciple,
  generateCertificate,
  attestationCertificateToOwnersData,
};
