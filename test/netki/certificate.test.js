const {
  generateCertificate,
  attestationCertificateToOwnersData,
  validateProtobufSignature,
} = require("../../src/netki");
const { readFileSync } = require("fs");
const netki = require("../../src/netki/proto/generated/payment_pb");
const { pki } = require("node-forge");

describe("test generate certificate", () => {
  it("should work", async () => {
    const rootPrivateKey = readFileSync(`${__dirname}/fake.key`).toString();
    const rootCertificate = readFileSync(`${__dirname}/fake.crt`).toString();

    const certificateResult = await generateCertificate(
      rootCertificate,
      rootPrivateKey,
      [
        {
          attestation: "LEGAL_PERSON_PRIMARY_NAME",
          ivmsConstraints: "BIRT",
          data: "This is the data for LEGAL_PERSON_PRIMARY_NAME",
        },
        {
          attestation: "LEGAL_PERSON_SECONDARY_NAME",
          ivmsConstraints: "BIRT",
          data: "This is the data for LEGAL_PERSON_SECONDARY_NAME",
        },
        {
          attestation: "NATURAL_PERSON_FIRST_NAME",
          ivmsConstraints: "MAID",
          data: "This is the data for NATURAL_PERSON_FIRST_NAME",
        },
      ]
    );

    // try validate certificate by parent certificate
    certificateResult.forEach((cr) => {
      const piiCert = pki.certificateFromPem(cr.certificatePem);
      const parentCert = pki.certificateFromPem(rootCertificate);

      const isValid = parentCert.verify(piiCert);
      expect(isValid).toEqual(true);
    });

    const binary = attestationCertificateToOwnersData(certificateResult);
    const decodedOwner = netki.Owner.deserializeBinary(binary);
    // verify signature
    decodedOwner.getAttestationsList().forEach((a) => {
      const cert = pki.certificateFromPem(Buffer.from(a.getPkiData()));
      const pubKeyPem = pki.publicKeyToPem(cert.publicKey);
      const result = validateProtobufSignature(a, pubKeyPem);
      expect(result).toEqual(true);
    });
  });
});
