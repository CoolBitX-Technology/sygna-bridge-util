# JavaScript Sygna Bridge Util

## Installation

```shell
npm i sygna-bridge-util
```

## Crypto

Encoding, Decoding, Signing and Verifying in Sygna.

### ECIES Encode an Deocde private information

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

There are two API calls from **transaction originator** to Sygna Bridge Server Define in the protocol, which are `transfer` and `send-txid`. They can be found under `api.originator`.

The full logic of originator would be like the following:

```javascript
const transaction = { "originator_vasp_code":"10000", "originator_addr":"3MNDLKJQW109J3KASM344", "beneficiary_vasp_code":"10298", "beneficiary_addr":"0x1234567890101010", "transaction_currency":"0x80000000", "amount": 0.973 };
const privateSenderInfo = { "originator": { "name": "Antoine Griezmann", "date_of_birth":"1991-03-21" } };
const recipientPublicKey = await sygnaBridgeUtil.api.getVASPPublicKey("https://sygna/bridge/api", "API_KEY", "10298");

const hex_data = sygnaBridge.crypto.sygnaEncodePrivateObj(privateSenderInfo, recipientPublicKey);
const objectToSign = { hex_data, transaction };
const originator_signature = sygnaBridgeUtil.crypto.signObject(objectToSign, privateKey);

let transfer_id = await sygnaBridge.api.originator.transfer("https://sygna/bridge/api", "API_KEY", hex_data, transaction, originator_signature, "https://originatorDomain")

// Boradcast your transaction to blockchain after got and api reponse at your api server.
const txid = await whatever.boardcast(rawTxPayload);

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

If you're trying to implement the beneficiary server on your own, we strongly recommand you to take a look at our [Nodejs sample]() to get a big picture of how it should behave in the ecosystem.
