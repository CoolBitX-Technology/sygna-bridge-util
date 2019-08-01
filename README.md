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

const sensitive_data = {
    "originator": {
        "name": "Antoine Griezmann", //required and must be in English
        "date_of_birth":"1991-03-21"
    },
    "beneficiary":{
        "name": "Leo Messi"
    }
};

const private_info = sygnaBridgeUtil.crypto.sygnaEncodePrivateObj(sensitive_data, recipient_pubKey);
const decoded_priv_info = sygnaBridge.crypto.sygnaDecodePrivateObg(private_info, recipient_privKey)

```

### Sign and Verify

In Sygna Bridge, we use secp256k1 ECDSA over sha256 of utf-8 json string to create signature on every API call. Since you need to provide the identical utf-8 string during verfication, the order of key-value pair you put into the object is important.

The following example is the snippet of originator's signing process of `transfer` API call. If you put the key `transaction` before `private_info` in the object, the verification will fail in the central server.

```javascript
let transaction = {
    originator_vasp_code:"10000",
    originator_addr:"3MNDLKJQW109J3KASM344",
    beneficiary_vasp_code:"10001",
    beneficiary_addr:"0x1234567890101010",
    transaction_currency:"0x80000000",
    amount: 0.973
}

let data_dt = "2019-07-29T06:28:00Z"

// using signObject to get a valid signed object (with signature attached)

let obj = {
    private_info,
    transaction,
    data_dt
};

sygnaBridgeUtil.crypto.signObject(obj, originator_privKey);

const valid = sygnaBridgeUtil.crypto.verifyObject(obj, originator_pubKey);

// or you can use the method that's built for `transfer` request:
let signed_obj = sygnaBridgeUtil.crypto.signTransferData(private_info, transaction, data_dt, originator_privKey)
valid = sygnaBridgeUtil.crypto.verifyObject(signed_obj, originator_pubKey);

```

## API

API calls to communicate with Sygna Bridge server.

We use **baisc auth** with all the API calls. To simplify the process, we provide a API class to deal with authentication and post/ get request format.

```javascript
const sbServer = "https://sygna-bridge.io/api"
const sbAPI = new sygnaBridgeUtil.API("username", "pwd", sbServer)
```

After you create the `API` instance, you can use it to make any API call to communicate with Sygna Bridge central server.

### Get VASP Information

```javascript
// Get List of VASPs associated with public keys.
const verify = true // set verify to true to verify the signature attached with api response automatically.
const vasps = await sbAPI.getVASPList(verify);

// Or call use getVASPPublicKey() to directly get public key for a specific VASP.
const publicKey = await sbAPI.getVASPPublicKey("10298", verify);
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
