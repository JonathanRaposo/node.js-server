
module.exports = () => {

    const values = ['a', 'b',
        'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    ]

    let id = '';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * values.length);
        id += values[randomIndex];
    }
    return id;
}

