# JavaScript Sygna Bridge Util

This is a Javascript library to help you build servers/servies within Sygna Bridge Ecosystem. For more detail information about Sygna Bridge, please go through the [Official Sygna Bridge API Document](https://coolbitx.gitlab.io/sygna/bridge/api/#sygna-bridge).

## Installation

<a href="https://nodei.co/npm/sygna-bridge-util/"><img src="https://nodei.co/npm/sygna-bridge-util.png"></a>

```shell
npm i sygna-bridge-util
```

## Crypto

Dealing with encoding, decoding, signing and verifying in Sygna Bridge.

### ECIES Encoding an Decoding

During the communication of VASPs, there are some private information that must be encrypted. We use ECIES(Elliptic Curve Integrated Encryption Scheme) to securely encrypt these private data so that they can only be accessed by the recipient.

```javascript

const privateInfo = {
    "originator": {
        "name": "Antoine Griezmann", //required and must be in English
        "date_of_birth":"1991-03-21"
    }
};

const encoded_info = sygnaBridgeUtil.crypto.sygnaEncodePrivateObj(privateInfo, recipient_pubKey);
const decoded_priv_info = sygnaBridge.crypto.sygnaDecodePrivateObg(encoded_info, recipient_privKey)

```

### Sign and Verify

In Sygna Bridge, we use secp256k1 ECDSA over sha256 of utf-8 json string to create signature on every API call. Since you need to provide the identical utf-8 string during verficication, the order of key-value pair you put into the object is important.

The following example is the snippet of originator's signing process of `transfer` API call. If you put the key `transaction` before `hex_data` in the object, the verification will fail in the central server.

```javascript

let obj = {
    "hex_data": encoded_info,
    "transaction":{
        "originator_vasp_code":"10000",
        "originator_addr":"3MNDLKJQW109J3KASM344",
        "beneficiary_vasp_code":"10001",
        "beneficiary_addr":"0x1234567890101010",
        "transaction_currency":"0x80000000",
        "amount": 0.973
    }
};

const originator_signature = sygnaBridgeUtil.crypto.signObject(obj, originator_privKey);
const valid = sygnaBridgeUtil.crypto.verifyObject(obj, originator_pubKey, originator_signature);

```

## API

API calls to communicate with Sygna Bridge server.

### Get VASP Information

```javascript
// Get List of VASPs associated with public keys.
const vasps = await sygnaBridgeUtil.api.getVASPList("https://sygna/bridge/api", "API_KEY");

// Or call use getVASPPublicKey() to directly get public key for a specific VASP.
const publicKey = await sygnaBridgeUtil.api.getVASPPublicKey("https://sygna/bridge/api", "API_KEY", "10298");
```

### For Originator

There are two API calls from **transaction originator** to Sygna Bridge Server defined in the protocol, which are `transfer` and `send-txid`. They can be found under `api.originator`.

The full logic of originator would be like the following:

```javascript
// originator.js

const transaction = { "originator_vasp_code":"10000", "originator_addr":"3MNDLKJQW109J3KASM344", "beneficiary_vasp_code":"10298", "beneficiary_addr":"0x1234567890101010", "transaction_currency":"0x80000000", "amount": 0.973 };
const privateSenderInfo = { "originator": { "name": "Antoine Griezmann", "date_of_birth":"1991-03-21" } };
const recipientPublicKey = await sygnaBridgeUtil.api.getVASPPublicKey("https://sygna/bridge/api", "API_KEY", "10298");

const hex_data = sygnaBridge.crypto.sygnaEncodePrivateObj(privateSenderInfo, recipientPublicKey);
const objectToSign = { hex_data, transaction };
const originator_signature = sygnaBridgeUtil.crypto.signObject(objectToSign, privateKey);

const transfer_id = await sygnaBridge.api.originator.transfer("https://sygna/bridge/api", "API_KEY", hex_data, transaction, originator_signature, "https://originatorDomain")

// Boradcast your transaction to blockchain after got and api reponse at your api server.
// const txid = await whatever.boardcast(rawTxPayload);

// Inform Sygna Bridge that a specific transfer is successfully broadcasted to the blockchain.
const result = await sygnaBridge.api.originator.sendTransactionId("https://sygna/bridge/api", "API_KEY", txid, transfer_id, originator_signature);

```

### For Beneficiary

There is only one api for Beneficiary to call, which is `callBackConfirmNotification`. After the beneficiary server confirm thet legitemacy of a transfer, they will sign `{ transfer_id, result }`, and send the result with signature to Sygna Bridge Central Server.

```javascript
let params = { transfer_id, result };
const beneficiary_signature = sygnaBridge.crypto.signObject(params, privateKey);
params.beneficiary_signature = beneficiary_signature;
await sygnaBridgeUtil.api.beneficiary.callBackConfirmNotification("https://sygna/bridge/api", API_KEY, params);
```

If you're trying to implement the beneficiary server on your own, we strongly recommand you to take a look at our [Nodejs sample](https://github.com/CoolBitX-Technology/) to get a big picture of how it should behave in the ecosystem.
