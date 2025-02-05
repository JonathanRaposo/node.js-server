
// const queryString = 'name=John+Doe&age=39&email=john%40gmail.com';

function parseQueryString(str) {

    const pairs = str.split('&');
    const obj = {};
    for (let pair of pairs) {
        const [key, value] = pair.split('=');
        const urlDecodedKey = decodeURIComponent(key).replace(/\+/g, ' ');
        const urlDecodedValue = decodeURIComponent(value).replace(/\+/g, ' ');
        obj[urlDecodedKey] = urlDecodedValue;
    }
    return obj;

}
module.exports = parseQueryString;

