const path = require('path');
const fs = require('fs');

const users = [];

module.exports = class User {
    constructor(userName, tag, email, password, birthDate){
        this.userName = userName;
        this.tag = tag;
        this.email = email;
        this.password = password;
        this.birthDate = birthDate;
    };

    save() {
        const p = path.join(
            path.dirname(process.mainModule.filename),
            'data',
            'users.json'
        );
        fs.readFile(p, (err, fileContent) => {
            let products = [];
            if(!err) {
                users = JSON.parse(fileContent);
            };
            users.push(this);
            fs.writeFile(p, JSON.stringify(users), (err) => {
                console.log(err);
            });
        });
    };

    static fetchAll() {
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                return [];
            };
            return JSON.parse(fileContent);
        });
        return users;
    };
}

/*
const userSchema = mongoose.Schema({
    id: {
        type: String,
        default: uuidv4()
    },
    userName: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    tag: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    birthDate: {
        type: Date,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
})

export const User = mongoose.model('user', userSchema);
*/