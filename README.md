# JavaScript Sygna Bridge Util

This is a Javascript library to help you build servers/servies within Sygna Bridge Ecosystem. For more detail information, please see [Sygna Bridge](https://www.sygna.io/).

## Installation

```shell
npm i @sygna/bridge-util
```

## Crypto

Dealing with encrypting, decrypting, signing and verifying in Sygna Bridge.

### ECIES Encrypting an Decrypting

During the communication of VASPs, there are some private information that must be encrypted. We use ECIES(Elliptic Curve Integrated Encryption Scheme) to securely encrypt these private data so that they can only be accessed by the recipient.

We're using [IVMS101 (interVASP Messaging Standard)](https://intervasp.org/) as our private information format.

We also provide [IVMS101 Typescript Utility](https://github.com/CoolBitX-Technology/sygna-bridge-ivms-utils/tree/master/typescript) to construct data payload.

```javascript
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
      "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV"
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
      "rAPERVgXZavGgiGv6xBgtiZurirW2yAmY"
    ]
  }
};

const private_info = sygnaBridgeUtil.crypto.encryptPrivateObj(
  sensitive_data,
  recipient_pubKey,
);
const decrypted_priv_info = sygnaBridge.crypto.decryptPrivateObj(
  private_info,
  recipient_privKey,
);
```

### Sign and Verify

In Sygna Bridge, we use secp256k1 ECDSA over sha256 of utf-8 json string to create signature on every API call. Since you need to provide the identical utf-8 string during verification, the order of key-value pair you put into the object is important.

The following example is the snippet of originator's signing process of `permissionRequest` API call. If you put the key `transaction` before `private_info` in the object, the verification will fail in the central server.

```javascript
let transaction = {
  originator_vasp:{
    vasp_code: 'VASPUSNY1',
    "addrs": [
      {
        "address": "r3kmLJN5D28dHuH8vZNUZpMC43pEHpaocV",
        "addr_extra_info": []
      }
    ]
  },
  beneficiary_vasp:{
    vasp_code: 'VASPUSNY1',
    "addrs": [
      {
        "address": "rAPERVgXZavGgiGv6xBgtiZurirW2yAmY",
        "addr_extra_info": []
      }
    ]
  },
  currency_id: 'sygna:0x80000000',
  amount: "0.973",
};

let data_dt = '2019-07-29T06:28:00Z';

// using signObject to get a valid signed object (with signature attached)

let obj = {
  private_info,
  transaction,
  data_dt,
};

sygnaBridgeUtil.crypto.signObject(obj, originator_privKey);

const valid = sygnaBridgeUtil.crypto.verifyObject(obj, originator_pubKey);

// or you can use the method that's built for `transfer` request:
let signed_obj = sygnaBridgeUtil.crypto.signPermissionRequest(
  obj,
  originator_privKey,
);

valid = sygnaBridgeUtil.crypto.verifyObject(signed_obj, originator_pubKey);
```

We provide different methods like `signPermissionRequest`, `signCallback()` to sign different objects(or parameters) we specified in our api doc. You can also find more examples in the following section.

## API

API calls to communicate with Sygna Bridge server.

We use **baisc auth** with all the API calls. To simplify the process, we provide a API class to deal with authentication and post/ get request format.

```javascript
const sbServer = 'https://api.sygna.io/';
const sbAPI = new sygnaBridgeUtil.API('api-key', sbServer);
```

After you create the `API` instance, you can use it to make any API call to communicate with Sygna Bridge central server.

### Get VASP Information

```javascript
// Get List of VASPs associated with public keys.
const verify = true; // set verify to true to verify the signature attached with api response automatically.
const vasps = await sbAPI.getVASPList(verify);

// Or call use getVASPPublicKey() to directly get public key for a specific VASP.
const publicKey = await sbAPI.getVASPPublicKey('10298', verify);
```

### For Originator

There are two API calls from **transaction originator** to Sygna Bridge Server defined in the protocol, which are `postPermissionRequest` and `postTransactionId`.

The full logic of originator would be like the following:

```javascript
// originator.js

const recipientPublicKey = await sbAPI.getVASPPublicKey('10298');
const private_info = sygnaBridge.crypto.encryptPrivateObj(
  // sensitive_data from example above
  sensitive_data,
  recipientPublicKey,
);

const signPermissionRequestData = {
  private_info,
  // from example above
  transaction,
  data_dt,
};
const transferObj = sygnaBridgeUtil.crypto.signPermissionRequest(
  signPermissionRequestData,
  sender_privKey,
);

const callback_url =
  'https://81f7d956.ngrok.io/api/v2/originator/transaction/premission';

const signCallBackData = {
  callback_url,
};
const callbackObj = sygnaBridgeUtil.crypto.signCallBack(
  signCallBackData,
  sender_privKey,
);

const postPermissionRequestData = {
  data: transferObj,
  callback: callbackObj,
};
const { transfer_id } = await sbAPI.postPermissionRequest(
  postPermissionRequestData,
);

// Broadcast your transaction to blockchain after got and api response at your api server.
const txid = '1a0c9bef489a136f7e05671f7f7fada2b9d96ac9f44598e1bcaa4779ac564dcd';

// Inform Sygna Bridge that a specific transfer is successfully broadcasted to the blockchain.
const signTxIdData = {
  transfer_id,
  txid,
};
let sendTxIdObj = sygnaBridgeUtil.crypto.signTxId(signTxIdData, sender_privKey);
let result = await sygnaAPI.postTransactionId(sendTxIdObj);
```

### For Beneficiary

There is only one api for Beneficiary VASP to call, which is `postPermission`. After the beneficiary server confirm their legitimacy of a transfer request, they will sign `{ transfer_id, permission_status }` using `signPermission()` function, and send the result with signature to Sygna Bridge Central Server.

```javascript
const permission_status = 'ACCEPTED'; // or "REJECTED"
const signPermissionData = {
  transfer_id,
  permission_status,
};
const permissionObj = sygnaBridgeUtil.crypto.signPermission(
  signPermissionData,
  beneficiary_privKey,
);
const finalResult = await sygnaAPI.postPermission(permissionObj);
```

For more complete example, please refer to [Example](example/index.js) file.
