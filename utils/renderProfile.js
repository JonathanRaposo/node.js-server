
const renderProfile = (company, htmlContent, res) => {

    htmlContent = htmlContent.replace('{{name}}', company.name || 'N/A');
    htmlContent = htmlContent.replace('{{description}}', company.description || 'N/A');
    htmlContent = htmlContent.replace('{{email}}', `<a href="https://${company.email}" target="_blank" id="compEmail">${company.email}</a>` || 'N/A');
    htmlContent = htmlContent.replace('{{industry}}', company.industry || 'N/A');
    htmlContent = htmlContent.replace('{{id}}', company.id);
    htmlContent = htmlContent.replace('{{id}}', company.id);



    res.writeHead(201, { 'content-type': 'text/html' });
    res.end(htmlContent);
}

module.exports = renderProfile;