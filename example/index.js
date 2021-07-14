const { API ,crypto, config} = require('../index');

const DOMAIN = config.SYGNA_BRIDGE_API_TEST_DOMAIN;

const ORIGINATOR_API_KEY = '{{ORIGINATOR_API_KEY}}';
const ORIGINATOR_PRIVATE_KEY = '{{ORIGINATOR_PRIVATE_KEY}}';
const ORIGINATOR_PUBLIC_KEY = '{{ORIGINATOR_PUBLIC_KEY}}';

const BENEFICIARY_API_KEY = '{{BENEFICIARY_API_KEY}}';
const BENEFICIARY_PRIVATE_KEY = '{{BENEFICIARY_PRIVATE_KEY}}';
const BENEFICIARY_PUBLIC_KEY = '{{BENEFICIARY_PUBLIC_KEY}}';

const sensitive_data = {
  "originator": {
    "originator_persons": [
      {
        "natural_person": {
          "name": {
            "name_identifiers": [
              {
                "primary_identifier": "Wu Xinli",
                "name_identifier_type": "LEGL"
              }
            ]
          },
          "national_identification": {
            "national_identifier": "446005",
            "national_identifier_type": "RAID",
            "registration_authority": "RA000553"
          },
          "country_of_residence": "TZ"
        }
      }
    ],
    "account_numbers": [
      "3KvJ1uHPShhEAWyqsBEzhfXyeh1TXKAd7D"
    ]
  },
  "beneficiary": {
    "beneficiary_persons": [
      {
        "legal_person": {
          "name": {
            "name_identifiers": [
              {
                "legal_person_name": "ABC Limited",
                "legal_person_name_identifier_type": "LEGL"
              }
            ]
          }
        }
      }
    ],
    "account_numbers": [
      "3F4ReDwiMLu8LrAiXwwD2DhH8U9xMrUzUf"
    ]
  }
};

function signAndVerify() {
  const data = { key: 'value' };
  const signedData = crypto.signObject(data, ORIGINATOR_PRIVATE_KEY);
  console.log(`signed_data = ${JSON.stringify(signedData)}`);

  const isCorrect = crypto.verifyObject(signedData, ORIGINATOR_PUBLIC_KEY);
  console.log(`isCorrect = ${isCorrect}`);
}

function encryptAndDecrypt() {
  const encryptedData = crypto.encryptPrivateObj(sensitive_data, BENEFICIARY_PUBLIC_KEY);
  console.log(`encryptedData = ${encryptedData}`);

  const decryptedData = crypto.decryptPrivateObj(
    encryptedData,
    BENEFICIARY_PRIVATE_KEY,
  );
  console.log(`decryptedData = ${JSON.stringify(decryptedData)}`);
}

async function getStatus() {
  const transfer_id =
    '9e28be67422352c4cdbd954f23765672e63b2b47e6746c1dcae1e5542e2ed631';
  const instance = new API(ORIGINATOR_API_KEY, DOMAIN);
  const response = await instance.getStatus(transfer_id);
  console.log(`getStatus response = ${JSON.stringify(response)}`);
}

async function getVASPList() {
  const is_need_valid = true;
  const is_prod = false;
  const instance = new API(ORIGINATOR_API_KEY, DOMAIN);
  const response = await instance.getVASPList(is_need_valid, is_prod);
  console.log(`getVASPList response = ${JSON.stringify(response)}`);
}

async function getVASPPublicKey() {
  const is_need_valid = true;
  const is_prod = false;
  const vasp_code = 'VASPJPJT4';
  const instance = new API(ORIGINATOR_API_KEY, DOMAIN);
  const public_key = await instance.getVASPPublicKey(
    vasp_code,
    is_need_valid,
    is_prod,
  );
  console.log(`getVASPPublicKey public_key = ${public_key}`);
}

async function getCurrencies() {
  const currency_id = 'sygna:0x80000090';
  const instance = new API(ORIGINATOR_API_KEY, DOMAIN);
  const response = await instance.getCurrencies({ currency_id });
  console.log(`getCurrencies response = ${JSON.stringify(response)}`);
}

async function postPermissionRequest() {
  const private_info = crypto.encryptPrivateObj(
    sensitive_data,
    BENEFICIARY_PUBLIC_KEY,
  );
  const permission_request_data = {
    private_info,
    transaction: {
      originator_vasp: {
        vasp_code: 'VASPUSNY1',
        addrs: [
          {
            address: 'r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV',
            addr_extra_info: [],
          },
        ],
      },
      beneficiary_vasp: {
        vasp_code: 'VASPUSNY2',
        addrs: [
          {
            address: 'rAPERVgXZavGgiGv6xBgtiZurirW2yAmY',
            addr_extra_info: [
              {
                tag: 'abc',
              },
            ],
          },
        ],
      },
      currency_id: 'sygna:0x80000090',
      amount: '1.23',
    },
    data_dt: '2020-07-13T05:56:53.088Z',
  };

  const signed_permission_request_data = crypto.signPermissionRequest(
    permission_request_data,
    ORIGINATOR_PRIVATE_KEY,
  );

  const callback = {
    callback_url:
      'https://81f7d956.ngrok.io/v2/originator/transaction/premission',
  };

  const signed_callback = crypto.signCallBack(callback, ORIGINATOR_PRIVATE_KEY);

  const post_permission_request_data = {
    data: signed_permission_request_data,
    callback: signed_callback,
  };
  const instance = new API(ORIGINATOR_API_KEY, DOMAIN);
  const response = await instance.postPermissionRequest(
    post_permission_request_data,
  );
  console.log(`postPermissionRequest response = ${JSON.stringify(response)}`);
}

async function postPermission() {
  const permission_data = {
    transfer_id:
      '3c6ee718f0d5b250859eecaa6f1ac7d4f9ccd2c8886f5dbcb2b249d2d515e836',
    permission_status: config.ACCEPTED,
  };

  const signed_permission_data = crypto.signPermission(
    permission_data,
    BENEFICIARY_PRIVATE_KEY,
  );

  const instance = new API(BENEFICIARY_API_KEY, DOMAIN);
  const response = await instance.postPermission(signed_permission_data);
  console.log(`postPermission response = ${JSON.stringify(response)}`);
}

async function postTxId() {
  const txid_data = {
    transfer_id:
      '3c6ee718f0d5b250859eecaa6f1ac7d4f9ccd2c8886f5dbcb2b249d2d515e836',
    txid: '1234567890',
  };

  const signed_txid_data = crypto.signPermission(
    txid_data,
    ORIGINATOR_PRIVATE_KEY,
  );

  const instance = new API(ORIGINATOR_API_KEY, DOMAIN);
  const response = await instance.postTransactionId(signed_txid_data);
  console.log(`postTxId response = ${JSON.stringify(response)}`);
}

async function postBeneficiaryEndpointUrl() {
  const beneficiary_endpoint_url_data = {
    callback_permission_request_url: 'https://google.com',
    vasp_code: 'VASPUSNY2',
    callback_txid_url: 'https://stackoverflow.com',
    callback_validate_addr_url: 'https://github.com',
  };

  const signed_beneficiary_endpoint_url_data = crypto.signBeneficiaryEndpointUrl(
    beneficiary_endpoint_url_data,
    BENEFICIARY_PRIVATE_KEY,
  );

  const instance = new API(BENEFICIARY_API_KEY, DOMAIN);
  const response = await instance.postBeneficiaryEndpointUrl(
    signed_beneficiary_endpoint_url_data,
  );
  console.log(
    `postBeneficiaryEndpointUrl response = ${JSON.stringify(response)}`,
  );
}

async function postRetry() {
  const retry_data = { vasp_code: 'VASPUSNY2' };

  const instance = new API(BENEFICIARY_API_KEY, DOMAIN);
  const response = await instance.postRetry(retry_data);
  console.log(`postRetry response = ${JSON.stringify(response)}`);
}

signAndVerify();
// encryptAndDecrypt();
// getStatus();
// getVASPList();
// getVASPPublicKey();
// getCurrencies();
// postPermissionRequest();
// postPermission();
// postTxId();
// postBeneficiaryEndpointUrl();
// postRetry();
