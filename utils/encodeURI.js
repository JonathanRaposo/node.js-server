
function encodeURI(input) {

    const unreservedChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_.~';
    let encode = '';
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (unreservedChar.includes(char)) {
            encode += char;

        } else {
            const hex = char.charCodeAt(0).toString(16).toUpperCase();
            console.log('hex value: ', hex)
            encode += "%" + hex.padStart(2, '0');
        }



    }
    return encode
}

module.exports = encodeURI;

console.log(encodeURI(str))