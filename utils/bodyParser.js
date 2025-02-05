const parseQueryString = require('./parseQueryString.js');

const bodyParser = (req, res, callback) => {

    const contentType = req.headers['content-type'];

    let body = '';

    req.on('data', (chunk) => {
        // console.log('*** Buffer.Raw data in hex values: ', chunk);
        body += chunk.toString();
    })
    req.on('end', () => {
        // console.log('body in the request:', body);

        let parsedBody;

        if (body) {
            if (contentType === 'application/x-www-form-urlencoded') {
                parsedBody = parseQueryString(body);
            }
            else if (contentType === 'application/json') {
                const parsed = JSON.parse(body);

                if (typeof parsed === 'object' && parsed !== null) {
                    parsedBody = parsed;
                } else {
                    res.writeHead(400, { 'content-type': 'application/json' });
                    res.end(JSON.stringify({ errorMessage: 'Invalid JSON format' }));
                    return;
                }

            }
            else {
                res.writeHead(400, { 'content-type': 'application/json' });
                res.end(JSON.stringify({ errorMessage: 'Unsupported content' }));
                return
            }

        } else {
            parsedBody = {};
        }
        callback(parsedBody);
    });

    // handle request errors
    req.on('error', () => {
        res.writeHead(500, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ errorMessage: 'Internal Server Error' }));
    });

}

module.exports = bodyParser