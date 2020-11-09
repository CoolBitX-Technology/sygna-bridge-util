const { pki } = require("node-forge");
const crypto = require("crypto");
const netki = require("./proto/generated/payment_pb");
const { signProtobufMessage, rsaKeyPairGen } = require("./crypto");
const { attestationToPrinciple } = require("./attestation");

exports.generateCertificate = async (
  parentCertificatePem,
  parentPrivateKeyPem,
  attestations
) => {
  // load parent private key
  const parentprivateKey = pki.privateKeyFromPem(parentPrivateKeyPem);
  const parentCertificate = pki.certificateFromPem(parentCertificatePem);

  const generated = [];
  for (const attestation of attestations) {
    const keyPair = await rsaKeyPairGen();
    var cert = pki.createCertificate();
    cert.publicKey = keyPair.publicKey;
    cert.serialNumber = crypto.randomBytes(16).toString("hex");

    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    // set 1y validity
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1
    );

    cert.setSubject(attestationToPrinciple(attestation));
    cert.setIssuer(parentCertificate.subject.attributes);

    cert.sign(parentprivateKey);
    generated.push({
      attestation: attestation.attestation,
      certificatePem: pki.certificateToPem(cert),
      privateKeyPem: pki.privateKeyToPem(keyPair.privateKey),
    });
  }

  return generated;
};

exports.attestationCertificateToOwnersData = (certificates) => {
  const owner = new netki.Owner();
  certificates.forEach((c) => {
    const att = new netki.Attestation();
    att.setAttestation(netki.AttestationType[c.attestation]);
    att.setPkiType("x509+sha256");
    att.setPkiData(Buffer.from(c.certificatePem, "utf8"));

    const signedAtt = signProtobufMessage(att, c.privateKeyPem);
    owner.addAttestations(signedAtt);
  });

  return owner.serializeBinary();
};
