
module.exports = (req, res, filePath) => {
    console.log(`*** URL:${req.url} *** METHOD:${req.method}`);
    console.log(`*** File path:${filePath}`)
}