
const http = require('http');
const fs = require('fs');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/trpc/siteSettings.getAll',
    method: 'GET',
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                const errorMsg = `ERROR MESSAGE: ${json.error.json.message}\nFULL ERROR: ${JSON.stringify(json, null, 2)}`;
                console.log(errorMsg);
                fs.writeFileSync('error_log.txt', errorMsg);
            } else {
                console.log('SUCCESS:', JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.log('RAW BODY:', data);
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
