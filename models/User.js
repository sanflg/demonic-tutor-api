const path = require('path');
const fs = require('fs');

const uuid = require('uuid');

const filePath = path.join(path.dirname(process.mainModule.filename), 'data', 'users.json');

const fetchAll = callback => {
    fs.readFile(filePath, (err, fileContent) => {
        if(err) callback([]);
        else callback(JSON.parse(fileContent));
    });
};

module.exports = class User {
    constructor(userName, tag, email, password, birthDate){
        this.id = uuid.v4();
        this.userName = userName;
        this.tag = tag;
        this.email = email;
        this.password = password;
        this.birthDate = birthDate;
    };

    static fetchAll(callback) {
        fetchAll(callback);
    };

    static getUserById = (callback, id) => {
        fetchAll(users => {
            //TODO: Replace by .find() once user saving structure is fixed.
            /*
            const user = users.find(u => u.id === id);
            callback(user);
            */
           //----------
            for (let user of users){
                if (user.id === id) {
                    return callback(user);
                };
            };
            return callback(null);
            //----------
        });
    };

    save() {
        fetchAll(users => {
            users.push(this);
            fs.writeFile(filePath, JSON.stringify(users), err => {
                console.log(err);
            });
        });
    };
};

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