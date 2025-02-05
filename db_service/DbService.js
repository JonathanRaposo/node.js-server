const idGenerator = require('../utils/idGenerator.js');
const fs = require('fs');
const path = require('path');


const filePath = path.join(__dirname, '..', 'database', 'companies.json');
if (!fs.existsSync(filePath)) {
    console.log('No file found...initializing database')
    fs.writeFileSync(filePath, '[]', 'utf-8');

}
const data = fs.readFileSync(filePath, 'utf-8');
let companies = JSON.parse(data);


class DbService {
    constructor() {
        this.data = companies;
    }
    find(options = {}) {
        const { keyword } = options;

        if (!keyword) {
            return this.data;
        }

        const matchCompanies = [];
        const regex = new RegExp(keyword, 'i');

        for (let company of this.data) {
            if (regex.test(company.name) || regex.test(company.description) || regex.test(company.industry)) {
                matchCompanies.push(company);
            }
        }
        return matchCompanies;
    }
    add(company) {
        const newCompany = {
            id: idGenerator(),
            createdAt: new Date(),
            ...company
        };
        this.data.push(newCompany);
        fs.writeFileSync(filePath, JSON.stringify(this.data), 'utf-8');
        return newCompany;

    }
    findById(id) {
        for (let i = 0; i < this.data.length; i++) {
            const company = this.data[i];
            if (company.id === id) return company;
        }
        return null;
    }
    findByIdAndUpdate(id, newData) {
        const index = this.data.findIndex((user) => user.id === id);
        console.log('index: ', index)
        if (index !== -1) {
            const company = this.data[index];
            const updatedData = {

                id: company.id,
                createdAt: company.createdAt,
                name: newData.name || company.name,
                description: newData.description || company.description,
                industry: newData.industry || company.industry,
                email: newData.email || company.email


            }
            this.data[index] = updatedData;
            fs.writeFileSync(filePath, JSON.stringify(this.data), 'utf-8');
            return this.data[index];
        }

        return null;
    }
    findByIdAndDelete(id) {
        let index = -1;
        for (let i = 0; i < this.data.length; i++) {
            const company = this.data[i];
            if (company.id === id) {
                index = i;
            }
        }
        if (index !== -1) {
            const company = this.data[index];
            this.data.splice(index, 1);
            fs.writeFileSync(filePath, JSON.stringify(this.data), 'utf-8');
            return company;
        }
        return null;

    }

}

module.exports = DbService;


