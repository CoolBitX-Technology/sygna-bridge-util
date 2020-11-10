const {
  signProtobufMessage,
  validateProtobufSignature,
  rsaKeyPairGen,
} = require("../../src/netki/crypto");
const {
  Attestation,
  AttestationType,
  ProtocolMessage,
  InvoiceRequest,
} = require("../../src/netki/proto/generated/payment_pb");
const { randomBytes } = require("crypto");
const { pki } = require("node-forge");
const { readFileSync } = require("fs");

describe("test netki related crypto", () => {
  const testData = {
    attestation: "LEGAL_PERSON_PRIMARY_NAME",
    certificatePem:
      "-----BEGIN CERTIFICATE-----\nMIIEoTCCA4mgAwIBAgIULTTWOWwqbANDwej5Z7Rdba7GE14wDQYJKoZIhvcNAQEL\nBQAwfzELMAkGA1UEBhMCVVMxCzAJBgNVBAgTAkNBMRQwEgYDVQQHEwtMb3MgQW5n\nZWxlczEZMBcGA1UECxMQTmV0a2kgT3BlcmF0aW9uczEyMDAGA1UEAxMpVHJhbnNh\nY3RJRCBJbnRlcm1lZGlhdGUgQ0FpIC0gREVWRUxPUE1FTlQwHhcNMjAxMDI3MDg1\nNDAwWhcNMjMxMDI3MDg1NDAwWjCBuDEJMAcGA1UEBhMAMQ0wCwYDVQQIEwRCSVJU\nMRwwGgYDVQQHExNsZWdhbFBlcnNvbk5hbWVUeXBlMRkwFwYDVQQKExBsZWdhbFBy\naW1hcnlOYW1lMTcwNQYDVQQLDC5UaGlzIGlzIHRoZSBkYXRhIGZvciBMRUdBTF9Q\nRVJTT05fUFJJTUFSWV9OQU1FMSowKAYDVQQDEyFsZWdhbFBlcnNvbk5hbWUucHJp\nbWFyeUlkZW50aWZpZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCR\nFvfmAsmXmTFp9JCyH0l1pUEdBt93TUz2p3P4i6ugylTw5Dapi9jHAioU/0SaqXzv\nMPCjgSH8KUBr/yfe6cskJlAQi8DCaJ69shkEFCFugE/kFXsDBQyVljWg5BHyVqmn\nQ5sB4ROSvoJ4Ytr49a72NT8dhJ72YnfWX4LF8dyRkWrvqOBkPQsykiAT9g7zPJve\nhHXSvo5ALauiUH2xkwaWEyISmRfiZjR7u9dObCeyvyTwZCEnNDmn5zJTRSNQS2o2\nYLmIffTNmAqcnYZ8Ih+qlXA7eb0FhuBGozhnsFs22i8Utw+4mbxM32QQxVgpdGpn\njz88iuBDiFRxdkTJzKkhAgMBAAGjgdowgdcwDgYDVR0PAQH/BAQDAgWgMBMGA1Ud\nJQQMMAoGCCsGAQUFBwMCMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFMcDwufNmIeQ\nwhDtV99GIrWpnM0kMB8GA1UdIwQYMBaAFBphOAM8p0CRu093DDicYYkbsc7BMDQG\nCCsGAQUFBwEBBCgwJjAkBggrBgEFBQcwAYYYaHR0cHM6Ly9vY3NwLm15dmVyaWZ5\nLmlvMCwGA1UdHwQlMCMwIaAfoB2GG2h0dHBzOi8vY3JsLm15dmVyaWZ5LmlvL2Ny\nbDANBgkqhkiG9w0BAQsFAAOCAQEAqBjPkGgMo2yPeTVEMjThFsyAQj5yIVHrhCFF\nejPNq1Mt5zsW01TeyBGvSAnIvme7hX15RgyHQ6lEAqhUkNuZXy+oUdNaEkV0wvB/\nrLZlumNN7fhncJnm/AHfjwrdUcxC8ngHNb1w0zUe4SgJA7EF+0vz+eIdXULi1bFm\nA9vAVyqQDnv0k23wIlmoLhjkSuGJBhMbc0SyzpXtUuXtFUw4tX4hpapvpAIYSdS8\nI3MXBNDFFgWZCqhdrxjoKkQ5T16CGbA/0fn+szFviLb7JTpI7D7B7PP9liLemE36\nOqF6sT+IU6w+GnRT8SeF3FiIQ7YuzjResNDCJ/JCwjHBZJHmGQ==\n-----END CERTIFICATE-----\n",
    privateKeyPem:
      "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCRFvfmAsmXmTFp\n9JCyH0l1pUEdBt93TUz2p3P4i6ugylTw5Dapi9jHAioU/0SaqXzvMPCjgSH8KUBr\n/yfe6cskJlAQi8DCaJ69shkEFCFugE/kFXsDBQyVljWg5BHyVqmnQ5sB4ROSvoJ4\nYtr49a72NT8dhJ72YnfWX4LF8dyRkWrvqOBkPQsykiAT9g7zPJvehHXSvo5ALaui\nUH2xkwaWEyISmRfiZjR7u9dObCeyvyTwZCEnNDmn5zJTRSNQS2o2YLmIffTNmAqc\nnYZ8Ih+qlXA7eb0FhuBGozhnsFs22i8Utw+4mbxM32QQxVgpdGpnjz88iuBDiFRx\ndkTJzKkhAgMBAAECggEAHiVokqkHm/EfnEVNf0US7VfNxKs16ULtd95pMT5MBdek\neHzigq3k98ySU9SKO5x1sfk4NrDRD+S+VvIoJZ/sLnGrdxSik4JLYVzM59UK8TvF\n3b081u7Io5gXQnvA4tpw26knXueWOopM75iSqOHbXZrIp2hz4vuorKkhseFEFBaR\nwb8aUb/DeOsm1DBya/iYfKVMTjABNtLXdwyethYxaXIk76c/ZU6QlGa6XbRSkoU9\n09lBXtbY1Cee4sQTxR1PP7Ddbwd3xF/1+uxUsYojY8VEQstCHhl2C35NxGLeyco3\n8lE58Jwo8ZJVGz1XI/GPg2ENVS4Zfo7m0alcaP2YMQKBgQDxZ24ynCy2BwS3nfcW\nFlHmjsVEz131FIqCfEIRzuWBgOuB/kCwxXhM5udx/aE45j/WDljbTp5/p2U1Cayt\nUKn1rWDDwYtkluk3NeE84DjeKvxNeg6Z+M/5oNO1m8ITmRqMImaQudGg1XTfaMMU\n1RAX2MK963EgpgJZkqK9m+eUnQKBgQCZ3LzsmF3XT1X9hRskUh2qoOkdzynwZ+Pw\nsbhcAURrFsepq9nvHuxAmaL+YJcwnuRVPFbJ1tnm1wuWB8vQAm4uQrkjVOO745eG\nn8mpXCnV1RagGB1Oc8PtOoMj6y7pNXb15qe5LzVrRxN2GCSCb5608ILCD0rXbC9E\nYwGC9iJFVQKBgA6OniaPJGMVqUMpU20Ri37LvTmZB6Fvy6pys8k/ILfeflUob945\nCjgY9Hv7P22e9NqDovgWlZg9D+1S2AbbhmQ6QEuNsEowj3+00BBLtSIwlWZWperD\nBkeXWyzoZ5um7+LjcCvqCKoaNSIDvz/SWVYWzCeHuxqs6BdesFGexShBAoGAP5Gw\nyLvHAb84ku8coKwAr8+doQBHnpj91yNGPVUUtH4L7jEfcKlBCQuxCRJVRPRQ+Fpe\nrTPEgZhVpB4CeiWW6iwNG+jl0moc37VC92MpsbxBhdGQwioYR/pF1mBD2HyLctti\nbqNvmawbAU7GPtHpK263R4BT9p8vBD03kakpzaUCgYBC6LbaZtREY24EudkQEXt1\nR7TvKhtqh4RrDCjChyotOGOjTq9xzYxuP8HQ3qPNX8JNmBAjejLNbsl49iB7bBpg\n+lRZQayBBA22jBzSNC4h9QUIl7DnhCpDPzdHq1J4/BEOfdcDVknSAqN7Nhv2I3ay\ny0uidvp+GdkCacwn3rq49g==\n-----END PRIVATE KEY-----\n",
  };

  it("test sign and verify", async () => {
    const att = new Attestation();
    att.setAttestation(AttestationType.LEGAL_PERSON_PRIMARY_NAME);
    att.setPkiType("x509+sha256");
    // does not matter
    att.setPkiData(Buffer.from(randomBytes(128).toString("base64")));

    // sign with privKey
    const kp = await rsaKeyPairGen();
    const signedAtt = signProtobufMessage(
      att,
      pki.privateKeyToPem(kp.privateKey)
    );

    // verify with public key
    const isValid = validateProtobufSignature(
      signedAtt,
      pki.publicKeyToPem(kp.publicKey)
    );
    expect(isValid).toEqual(true);
  });

  it("test sign against sapphire output", () => {
    const att = new Attestation();
    att.setAttestation(AttestationType[testData.attestation]);
    att.setPkiType("x509+sha256");
    att.setPkiData(Buffer.from(testData.certificatePem));

    // sign
    const signedAtt = signProtobufMessage(att, testData.privateKeyPem);

    // load sapphire output
    const sapphireOutBinary = readFileSync(`${__dirname}/response.bin`);
    const msg = ProtocolMessage.deserializeBinary(sapphireOutBinary);

    const invoiceReq = InvoiceRequest.deserializeBinary(
      msg.getSerializedMessage()
    );
    const netkiAtt = invoiceReq.getOwnersList()[0].getAttestationsList()[0];

    const ourSignatureStr = Buffer.from(signedAtt.getSignature()).toString();
    const netkiSignatureStr = Buffer.from(netkiAtt.getSignature()).toString();
    expect(ourSignatureStr).toEqual(netkiSignatureStr);
  });

  it("test verify against sapphire output", () => {
    // load sapphire output
    const sapphireOutBinary = readFileSync(`${__dirname}/response.bin`);
    const msg = ProtocolMessage.deserializeBinary(sapphireOutBinary);

    const invoiceReq = InvoiceRequest.deserializeBinary(
      msg.getSerializedMessage()
    );
    const netkiAtt = invoiceReq.getOwnersList()[0].getAttestationsList()[0];

    // get public key pem from certificate
    const cert = pki.certificateFromPem(testData.certificatePem);
    const publicKeyPem = pki.publicKeyToPem(cert.publicKey);

    const isValid = validateProtobufSignature(netkiAtt, publicKeyPem);
    expect(isValid).toEqual(true);
  });
});
