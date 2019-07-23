const fetch = require('node-fetch');

async function postSygnaBridge (url, headers, json ) {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(json),
        headers: headers
    });
    return await response.json();
}

async function getSygnaBridge (url, headers ) {
    const response = await fetch(url, { headers:headers });
    return await response.json();
}

module.exports = {
    postSygnaBridge,
    getSygnaBridge
};