# JavaScript Sygna Bridge Util

## Installation

```
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
