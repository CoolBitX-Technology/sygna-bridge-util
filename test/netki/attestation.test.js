const { ivmsToAttestations } = require("../../src/netki/attestation");

describe("test attestation", () => {
  it("should convert ivms json to attestation array", async () => {
    const result = ivmsToAttestations({
      originator: {
        originator_persons: [
          {
            natural_person: {
              name: {
                name_identifiers: [
                  {
                    primary_identifier: "Wu",
                    secondary_identifier: "Xinli",
                    name_identifier_type: "LEGL",
                  },
                ],
              },
              national_identification: {
                national_identifier: "446005",
                national_identifier_type: "RAID",
                registration_authority: "RA000553",
              },
              country_of_residence: "TZ",
            },
          },
        ],
        account_numbers: ["1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2"],
      },
      beneficiary: {
        beneficiary_persons: [
          {
            natural_person: {
              name: {
                name_identifiers: [
                  {
                    primary_identifier: "Brenden",
                    secondary_identifier: "Samuels",
                    name_identifier_type: "LEGL",
                  },
                ],
              },
            },
          },
        ],
        account_numbers: ["1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY"],
      },
      payload_metadata: {
        transliteration_method: ["HANI"],
      },
    });

    expect(result).toEqual([
      {
        attestation: "NATURAL_PERSON_FIRST_NAME",
        data: "Xinli",
        ivmsConstraints: "LEGL",
      },
      {
        attestation: "NATURAL_PERSON_LAST_NAME",
        data: "Wu",
        ivmsConstraints: "LEGL",
      },
      {
        attestation: "BENEFICIARY_PERSON_FIRST_NAME",
        data: "Samuels",
      },
      {
        attestation: "BENEFICIARY_PERSON_LAST_NAME",
        data: "Brenden",
      },
      {
        attestation: "COUNTRY_OF_RESIDENCE",
        data: "TZ",
      },
      {
        attestation: "NATIONAL_IDENTIFIER_NUMBER",
        data: "446005",
      },
      {
        attestation: "NATIONAL_IDENTIFIER",
        data: "446005",
        ivmsConstraints: "RAID",
      },
      {
        attestation: "ACCOUNT_NUMBER",
        data: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
      },
      {
        attestation: "REGISTRATION_AUTHORITY",
        data: "RA000553",
      },
    ]);
  });
});
