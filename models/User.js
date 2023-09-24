const path = require('path');
const fs = require('fs');

const uuid = require('uuid');

const db = require('../utils/database');

module.exports = class User {
    constructor(userName, tag, email, password, birthDate){
        this.userName = userName;
        this.tag = tag;
        this.email = email;
        this.password = password;
        this.birthDate = birthDate;
    };

    static fetchAll() {
        return db.execute('SELECT * FROM demonic_tutor.users')
    };

    static getUserById(id) {
        return db.execute(`SELECT * FROM demonic_tutor.users WHERE id = "${id}"`)
    };

    static deleteUser(id) {
        return db.execute(`DELETE FROM demonic_tutor.users WHERE id = "${id}"`)
    };

    save() {
        this.id = uuid.v4();
        return db.execute(`
            INSERT INTO demonic_tutor.users (id, user_name, tag, email, password, birth_date, created_date_time)
            VALUES ("${this.id}", "${this.userName}", "${this.tag}", "${this.email}", "${this.password}", "${this.birthDate}", ${Date.now()});`)
    };
};