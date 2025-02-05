
const fs = require('fs');
const path = require('path');


const renderErrorPage = (err, res) => {
    console.log('Error reading File: ', err)
    if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, '..', 'views', 'errorPage.html'), (err, htmlErrContent) => {
            if (err) {
                console.log('Error reading error page file:', err);
                res.writeHead(500, { 'content-type': 'text/html' });
                res.end('<h2> 500- Internal Server Error</h2>', 'utf-8');
                return;
            }
            res.writeHead(404, { 'content-type': 'text/html' });
            res.end(htmlErrContent, 'utf-8');
        })

    } else {
        console.error('Server error: ', err);
        res.writeHead(500, { 'content-type': 'text/html' });
        res.end('<h2>500 - Internal Server Error</h2>', 'utf-8');
    }


}

module.exports = renderErrorPage;