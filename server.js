const http = require('http');
const fs = require('fs');
const path = require('path');
const DEFAULTPORT = require('./utils/constant.js')
const logger = require('./utils/logger.js');
const bodyParser = require('./utils/bodyParser.js');
const renderErrorPage = require('./utils/renderErrorPage.js');
const renderProfile = require('./utils/renderProfile.js');
const prepopulateForm = require('./utils/prepopulateForm.js');
const DbService = require('./db_service/DbService.js');
const dbService = new DbService();
const parseQueryString = require('./utils/parseQueryString.js');


const server = http.createServer((req, res) => {

    // GET- Route to get all campanies
    if (req.url.match(/\/companies\/search\?q=([a-zA-Z0-9%_\-]+)/) && req.method === 'GET') {
        console.log('url for search route: ', req.url);

        const queryParams = req.url.split('?')[1];
        const parsedQuery = parseQueryString(queryParams)
        const { q: query } = parsedQuery;
        const companies = dbService.find({ keyword: query });

        if (companies.length > 0) {
            fs.readFile(path.join(__dirname, 'views', 'companyListPage.html'), 'utf-8', (err, htmlContent) => {
                if (err) {
                    renderErrorPage(err, res);
                    return;
                }
                let companyListHtml = [];
                for (let company of companies) {
                    companyListHtml.push(`<li><a href="/companies/${company.id}">${company.name}</a></li>`);
                }

                htmlContent = htmlContent.replace('{{heading}}', 'List of companies');
                htmlContent = htmlContent.replace('{{companies}}', companyListHtml.join(''));
                res.writeHead(200, { 'content-type': 'text/html' });
                res.end(htmlContent);

            })
        } else {
            fs.readFile(path.join(__dirname, 'views', 'companyNotFoundPage.html'), 'utf-8', (err, htmlContent) => {
                if (err) {
                    renderErrorPage(err, res);
                    return;
                }
                htmlContent = htmlContent.replace('{{company}}', query);
                res.writeHead(404, { 'content-type': 'text/html' });
                res.end(htmlContent);
            })
        }
        return;
    }

    if (req.url === '/companies' && req.method === 'GET') {

        const companies = dbService.find();
        fs.readFile(path.join(__dirname, 'views', 'companyListPage.html'), 'utf-8', (err, htmlContent) => {
            if (err) {
                renderErrorPage(err, res);
                return;
            }
            let companyListHtml = [];
            for (let company of companies) {
                companyListHtml.push(`<li><a href="/companies/${company.id}">${company.name}</a></li>`);
            }
            let heading = companies.length > 0 ? 'List of Companies' : 'No company listed';

            htmlContent = htmlContent.replace('{{heading}}', heading);
            htmlContent = htmlContent.replace('{{companies}}', companyListHtml.join(''));
            res.writeHead(200, { 'content-type': 'text/html' });
            res.end(htmlContent);

        })

        return;
    }
    //GET-  Route to display form to add a company
    else if (req.url === '/companies/add' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, 'views', 'addCompanyPage.html'), (err, htmlContent) => {
            if (err) {
                renderErrorPage(err, res);
                return;
            }
            res.writeHead(200, { 'content-type': 'text/html' });
            res.end(htmlContent, 'utf-8');
        })
        return;
    }
    //POST-  Route to procces form and add company to the dabase
    else if (req.url === '/companies/add' && req.method === 'POST') {

        bodyParser(req, res, (parsedBody) => {
            const companyFromDB = dbService.add(parsedBody);
            fs.readFile(path.join(__dirname, 'views', 'profilePage.html'), 'utf-8', (err, htmlContent) => {
                if (err) {
                    renderErrorPage(err, res);
                    return;
                }
                renderProfile(companyFromDB, htmlContent, res);
            });

        });
        return;
    }
    else if (req.url.match(/\/companies\/([a-z0-9]+)\/delete/) && req.method === 'POST') {

        const companyId = req.url.split('/')[2];
        dbService.findByIdAndDelete(companyId);
        res.writeHead(302, { location: '/companies' });
        res.end();
        return;
    }

    // GET- display form to update a specific company
    else if (req.url.match(/\/companies\/([a-z0-9]+)\/update/) && req.method === 'GET') {


        const companyId = req.url.split('/')[2];
        const company = dbService.findById(companyId);

        fs.readFile(path.join(__dirname, 'views', 'updatePage.html'), 'utf-8', (err, htmlContent) => {
            if (err) {
                renderErrorPage(err, res);
                return;
            }
            prepopulateForm(company, htmlContent, res);
        });
        return;
    }

    else if (req.url.match(/\/companies\/([a-z0-9]+)/) && req.method === 'POST') {
        const companyId = req.url.split('/')[2];

        bodyParser(req, res, (parsedBody) => {
            console.log('parsed body: ', parsedBody);
            const updatedCompany = dbService.findByIdAndUpdate(companyId, parsedBody)
            console.log('updated company:', updatedCompany)
            res.writeHead(302, { location: `/companies/${companyId}` });
            res.end();
        })
        return;
    }

    //GET- Route to get a specific company
    else if (req.url.match(/\/companies\/([a-z0-9]+)/) && req.method === 'GET') {


        const companyId = req.url.split('/')[2];
        const company = dbService.findById(companyId);
        if (!company) {
            fs.readFile(path.join(__dirname, 'views', 'companyNotFoundPage.html'), (err, htmlContent) => {
                if (err) {
                    renderErrorPage(err, res);
                    return;
                }
                res.writeHead(404, { 'content-type': 'text/html' });
                res.end(htmlContent, 'utf-8');

            })
            return;
        }
        fs.readFile(path.join(__dirname, 'views', 'profilePage.html'), 'utf-8', (err, htmlContent) => {
            if (err) {
                renderErrorPage(err, res);
                return;
            }
            renderProfile(company, htmlContent, res);
        });
        return;
    }


    const filePath = req.url === '/' ? path.join(__dirname, 'views', 'homePage.html') : path.join(__dirname, req.url);

    // logger prints url,methods and file paths
    logger(req, res, filePath);

    const fileExt = path.extname(filePath)

    const mimeType = {
        '.css': 'text/css',
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png'

    }

    const contentType = mimeType[fileExt] || 'application/octet-stream';

    fs.readFile(filePath, (err, resource) => {
        console.log('hit companies route')

        if (err) {
            renderErrorPage(err, res);
            return;
        }
        res.writeHead(200, { 'content-type': contentType })
        res.end(resource, 'utf-8');

    });

});

const PORT = 5000 || DEFAULTPORT;
server.listen(PORT, () => console.log(`Server running on port:${PORT}`));


