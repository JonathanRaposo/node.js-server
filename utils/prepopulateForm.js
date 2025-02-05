module.exports = (company, htmlContent, res) => {

    htmlContent = htmlContent.replace('{{id}}', company.id);
    htmlContent = htmlContent.replace('{{name}}', company.name);
    htmlContent = htmlContent.replace('{{description}}', company.description);
    htmlContent = htmlContent.replace('{{industry}}', company.industry);
    htmlContent = htmlContent.replace('{{email}}', company.email);
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(htmlContent, 'utf-8');
}