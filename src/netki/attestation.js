const _ = require("lodash");

const getPricipleObject = (CN, C, L, O, OU, ST) => [
  {
    shortName: "CN",
    value: CN,
  },
  {
    shortName: "C",
    value: C,
  },
  {
    shortName: "L",
    value: L,
  },
  {
    shortName: "O",
    value: O,
  },
  {
    shortName: "OU",
    value: OU,
  },
  {
    shortName: "ST",
    value: ST,
  },
];

const validateIvmsConstrain = (attestation, ivmsConstraints) => {
  if (!ivmsConstraints) {
    return true;
  }
  switch (attestation) {
    case "LEGAL_PERSON_PRIMARY_NAME":
    case "LEGAL_PERSON_SECONDARY_NAME":
    case "NATURAL_PERSON_FIRST_NAME":
    case "NATURAL_PERSON_LAST_NAME":
    case "BENEFICIARY_PERSON_FIRST_NAME":
    case "BENEFICIARY_PERSON_LAST_NAME":
      return (
        ivmsConstraints == "ALIA" ||
        ivmsConstraints == "BIRT" ||
        ivmsConstraints == "MAID" ||
        ivmsConstraints == "LEGL" ||
        ivmsConstraints == "MISC"
      );
    case "ADDRESS_DEPARTMENT":
    case "ADDRESS_SUB_DEPARTMENT":
    case "ADDRESS_STREET_NAME":
    case "ADDRESS_BUILDING_NUMBER":
    case "ADDRESS_BUILDING_NAME":
    case "ADDRESS_FLOOR":
    case "ADDRESS_POSTBOX":
    case "ADDRESS_ROOM":
    case "ADDRESS_POSTCODE":
    case "ADDRESS_TOWN_NAME":
    case "ADDRESS_TOWN_LOCATION_NAME":
    case "ADDRESS_DISTRICT_NAME":
    case "ADDRESS_COUNTRY_SUB_DIVISION":
    case "ADDRESS_ADDRESS_LINE":
    case "ADDRESS_COUNTRY":
      return (
        ivmsConstraints == "GEOG" ||
        ivmsConstraints == "BIZZ" ||
        ivmsConstraints == "HOME"
      );
    case "NATIONAL_IDENTIFIER":
      return (
        ivmsConstraints == "CCPT" ||
        ivmsConstraints == "RAID" ||
        ivmsConstraints == "DRLC" ||
        ivmsConstraints == "FIIN" ||
        ivmsConstraints == "TXID" ||
        ivmsConstraints == "SOCS" ||
        ivmsConstraints == "IDCD" ||
        ivmsConstraints == "LEIX" ||
        ivmsConstraints == "MISC"
      );
    default:
      return false;
  }
};

exports.attestationToPrinciple = ({ attestation, ivmsConstraints, data }) => {
  let data64Characters = "";
  let extraData = "";

  if (!validateIvmsConstrain(attestation, ivmsConstraints)) {
    throw Error("Invalid IVMS constrain");
  }

  if (data.length > 64) {
    data64Characters = data.substring(0, 64);
    extraData = data.substring(64, data.length);
  } else {
    data64Characters = data;
  }

  switch (attestation) {
    case "LEGAL_PERSON_PRIMARY_NAME":
      return getPricipleObject(
        "legalPersonName.primaryIdentifier",
        extraData,
        "legalPersonNameType",
        "legalPrimaryName",
        data64Characters,
        ivmsConstraints
      );
    case "LEGAL_PERSON_SECONDARY_NAME":
      return getPricipleObject(
        "legalPersonName.secondaryIdentifier",
        extraData,
        "legalPersonNameType",
        "legalSecondaryName",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_DEPARTMENT":
      return getPricipleObject(
        "address.department",
        extraData,
        "department",
        "department",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_SUB_DEPARTMENT":
      return getPricipleObject(
        "address.subDepartment",
        extraData,
        "subDepartment",
        "subDepartment",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_STREET_NAME":
      return getPricipleObject(
        "address.streetName",
        extraData,
        "streetName",
        "streetName",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_BUILDING_NUMBER":
      return getPricipleObject(
        "address.buildingNumber",
        extraData,
        "buildingNumber",
        "buildingNumber",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_BUILDING_NAME":
      return getPricipleObject(
        "address.buildingName",
        extraData,
        "buildingName",
        "buildingName",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_FLOOR":
      return getPricipleObject(
        "address.floor",
        extraData,
        "floor",
        "floor",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_POSTBOX":
      return getPricipleObject(
        "address.postBox",
        extraData,
        "postBox",
        "postBox",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_ROOM":
      return getPricipleObject(
        "address.room",
        extraData,
        "room",
        "room",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_POSTCODE":
      return getPricipleObject(
        "address.postCode",
        extraData,
        "postCode",
        "postCode",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_TOWN_NAME":
      return getPricipleObject(
        "address.townName",
        extraData,
        "townName",
        "townName",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_TOWN_LOCATION_NAME":
      return getPricipleObject(
        "address.townLocationName",
        extraData,
        "townLocationName",
        "townLocationName",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_DISTRICT_NAME":
      return getPricipleObject(
        "address.districtName",
        extraData,
        "districtName",
        "districtName",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_COUNTRY_SUB_DIVISION":
      return getPricipleObject(
        "address.countrySubDivision",
        extraData,
        "countrySubDivision",
        "countrySubDivision",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_ADDRESS_LINE":
      return getPricipleObject(
        "address.addressLine",
        extraData,
        "addressLine",
        "addressLine",
        data64Characters,
        ivmsConstraints
      );
    case "ADDRESS_COUNTRY":
      return getPricipleObject(
        "address.country",
        extraData,
        "country",
        "country",
        data64Characters,
        ivmsConstraints
      );
    case "NATURAL_PERSON_FIRST_NAME":
      return getPricipleObject(
        "naturalName.secondaryIdentifier",
        extraData,
        "naturalPersonNameType",
        "naturalPersonFirstName",
        data64Characters,
        ivmsConstraints
      );
    case "NATURAL_PERSON_LAST_NAME":
      return getPricipleObject(
        "naturalName.primaryIdentifier",
        extraData,
        "naturalPersonNameType",
        "naturalPersonLastName",
        data64Characters,
        ivmsConstraints
      );
    case "BENEFICIARY_PERSON_FIRST_NAME":
      return getPricipleObject(
        "beneficiaryName.secondaryIdentifier",
        extraData,
        "beneficiaryPersonNameType",
        "beneficiaryPersonFirstName",
        data64Characters,
        ivmsConstraints
      );
    case "BENEFICIARY_PERSON_LAST_NAME":
      return getPricipleObject(
        "beneficiaryName.primaryIdentifier",
        extraData,
        "beneficiaryPersonNameType",
        "beneficiaryPersonLastName",
        data64Characters,
        ivmsConstraints
      );
    case "BIRTH_DATE":
      return getPricipleObject(
        "naturalPerson.dateOfBirth",
        extraData,
        "dateInPast",
        "birthdate",
        data64Characters,
        ivmsConstraints
      );
    case "BIRTH_PLACE":
      return getPricipleObject(
        "naturalPerson.placeOfBirth",
        extraData,
        "countryCode",
        "country",
        data64Characters,
        ivmsConstraints
      );
    case "COUNTRY_OF_RESIDENCE":
      return getPricipleObject(
        "naturalPerson.countryOfResidence",
        extraData,
        "countryCode",
        "country",
        data64Characters,
        ivmsConstraints
      );
    case "ISSUING_COUNTRY":
      return getPricipleObject(
        "nationalIdentifier.countryOfIssue",
        extraData,
        "nationalIdentifierType",
        "nationalIdentifier",
        data64Characters,
        ivmsConstraints
      );
    case "NATIONAL_IDENTIFIER_NUMBER":
      return getPricipleObject(
        "nationalIdentifier.number",
        extraData,
        "number",
        "documentNumber",
        data64Characters,
        ivmsConstraints
      );
    case "NATIONAL_IDENTIFIER":
      return getPricipleObject(
        "nationalIdentifier.documentType",
        extraData,
        "nationalIdentifierType",
        "documentType",
        data64Characters,
        ivmsConstraints
      );
    case "ACCOUNT_NUMBER":
      return getPricipleObject(
        "accountNumber",
        extraData,
        "accountNumber",
        "accountNumber",
        data64Characters,
        ivmsConstraints
      );
    case "CUSTOMER_IDENTIFICATION":
      return getPricipleObject(
        "customerIdentification",
        extraData,
        "customerIdentification",
        "customerIdentification",
        data64Characters,
        ivmsConstraints
      );
    case "REGISTRATION_AUTHORITY":
      return getPricipleObject(
        "registrationAuthority",
        extraData,
        "registrationAuthority",
        "registrationAuthority",
        data64Characters,
        ivmsConstraints
      );
    default:
      throw new Exception("Unknown attestationType");
  }
};

const attestationAdder = (
  attestationArr,
  attestationType,
  ivmsJson,
  dataPath,
  constrainPath
) => {
  const data = _.get(ivmsJson, dataPath, false);
  const constrain = _.get(ivmsJson, constrainPath, false);

  if (data) {
    const attestation = {
      attestation: attestationType,
      data,
    };
    if (constrain) {
      // check ivms constrain
      if (!validateIvmsConstrain(attestationType, constrain)) {
        throw Error("Field does not meet constrain");
      }
      attestation["ivmsConstraints"] = constrain;
    }
    attestationArr.push(attestation);
  }
};

exports.ivmsToAttestations = (ivmsJson) => {
  const attestationArr = [];
  // TODO: do we need to process multiple person, name, address?
  attestationAdder(
    attestationArr,
    "LEGAL_PERSON_PRIMARY_NAME",
    ivmsJson,
    "originator.originator_persons[0].legal_person.name.name_identifiers[0].legal_person_name",
    "originator.originator_persons[0].legal_person.name.name_identifiers[0].legal_person_name_identifier_type"
  );
  attestationAdder(
    attestationArr,
    "LEGAL_PERSON_SECONDARY_NAME",
    ivmsJson,
    // not sure!
    "originator.originator_persons[0].legal_person.name.name_identifiers[0].legal_person_name",
    "originator.originator_persons[0].legal_person.name.name_identifiers[0].legal_person_name_identifier_type"
  );
  // TODO: is address legal person or natual person or both
  attestationAdder(
    attestationArr,
    "ADDRESS_DEPARTMENT",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].department",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "ADDRESS_SUB_DEPARTMENT",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].sub_department",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "ADDRESS_STREET_NAME",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].street_name",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "ADDRESS_BUILDING_NUMBER",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].building_number",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "ADDRESS_BUILDING_NAME",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].building_name",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "ADDRESS_FLOOR",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].floor",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "ADDRESS_POSTBOX",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].post_box",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "ADDRESS_ROOM",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].room",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "ADDRESS_POSTCODE",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].post_code",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "ADDRESS_TOWN_NAME",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].town_name",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "ADDRESS_TOWN_LOCATION_NAME",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].town_location_name",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "ADDRESS_DISTRICT_NAME",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].district_name",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "ADDRESS_COUNTRY_SUB_DIVISION",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].country_sub_division",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  // array!?
  attestationAdder(
    attestationArr,
    "ADDRESS_ADDRESS_LINE",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_line[0]",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "ADDRESS_COUNTRY",
    ivmsJson,
    "originator.originator_persons[0].legal_person.geographic_addresses[0].country",
    "originator.originator_persons[0].legal_person.geographic_addresses[0].address_type"
  );
  attestationAdder(
    attestationArr,
    "NATURAL_PERSON_FIRST_NAME",
    ivmsJson,
    "originator.originator_persons[0].natural_person.name.name_identifiers[0].secondary_identifier",
    "originator.originator_persons[0].natural_person.name.name_identifiers[0].name_identifier_type"
  );
  attestationAdder(
    attestationArr,
    "NATURAL_PERSON_LAST_NAME",
    ivmsJson,
    "originator.originator_persons[0].natural_person.name.name_identifiers[0].primary_identifier",
    "originator.originator_persons[0].natural_person.name.name_identifiers[0].name_identifier_type"
  );
  // TODO: is BENEFICIARY always NATURAL PERSON?
  attestationAdder(
    attestationArr,
    "BENEFICIARY_PERSON_FIRST_NAME",
    ivmsJson,
    "beneficiary.beneficiary_persons[0].natural_person.name.name_identifiers[0].secondary_identifier"
  );
  attestationAdder(
    attestationArr,
    "BENEFICIARY_PERSON_LAST_NAME",
    ivmsJson,
    "beneficiary.beneficiary_persons[0].natural_person.name.name_identifiers[0].primary_identifier"
  );
  attestationAdder(
    attestationArr,
    "BIRTH_PLACE",
    ivmsJson,
    "originator.originator_persons[0].natural_person.date_and_place_of_birth.date_of_birth"
  );
  attestationAdder(
    attestationArr,
    "BIRTH_PLACE",
    ivmsJson,
    "originator.originator_persons[0].natural_person.date_and_place_of_birth.BIRTH_PLACE"
  );
  attestationAdder(
    attestationArr,
    "COUNTRY_OF_RESIDENCE",
    ivmsJson,
    "originator.originator_persons[0].natural_person.country_of_residence"
  );
  attestationAdder(
    attestationArr,
    "ISSUING_COUNTRY",
    ivmsJson,
    "originator.originator_persons[0].natural_person.national_identification.country_of_issue"
  );
  attestationAdder(
    attestationArr,
    "NATIONAL_IDENTIFIER_NUMBER",
    ivmsJson,
    "originator.originator_persons[0].natural_person.national_identification.national_identifier"
  );
  // not sure
  attestationAdder(
    attestationArr,
    "NATIONAL_IDENTIFIER",
    ivmsJson,
    "originator.originator_persons[0].natural_person.national_identification.national_identifier",
    "originator.originator_persons[0].natural_person.national_identification.national_identifier_type"
  );
  attestationAdder(
    attestationArr,
    "ACCOUNT_NUMBER",
    ivmsJson,
    "originator.account_numbers[0]"
  );
  attestationAdder(
    attestationArr,
    "CUSTOMER_IDENTIFICATION",
    ivmsJson,
    "originator.originator_persons[0].natural_person.customer_identification"
  );
  attestationAdder(
    attestationArr,
    "REGISTRATION_AUTHORITY",
    ivmsJson,
    "originator.originator_persons[0].natural_person.national_identification.registration_authority"
  );

  return attestationArr;
};

// TODO: convert attestations certificate to ivms json
