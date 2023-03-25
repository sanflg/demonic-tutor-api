import { v4 as uuidv4 } from 'uuid';

let users = [];

export const getUsers = (req, res) => {
    console.log("GET ROUTE REACHED");
    res.send(users);
}

export const createUser = (req, res) => {
    console.log('POST ROUTE REACHED');

    const user = req.body;
    users.push({ id: uuidv4(), ...user });
    res.send(`User with username "${user.userName}" created.`);
};

export const getUser = (req, res) => {
    console.log("GET ROUTE REACHED");

    const id = req.params.id;
    const foundUser = users.find((user) => user.id === id);

    res.send(foundUser);
};

export const deleteUser = (req, res) => {
    const { id } = req.params;
    users = users.filter((user) => user.id !== id);
    res.send(`User with id "${id}" deleted.`);
};

export const patchUser = (req, res) => {
    const { id } = req.params;
    const { userName, mail, password, birthDate, userTag } = req.body;
    const user = users.find((user) => user.id === id);

    if (userName) user.userName = userName;
    if (mail) user.mail = mail;
    if (password) user.password = password;
    if (birthDate) user.birthDate = birthDate;
    if (userTag) user.userTag = userTag;

    res.send(`User with id ${id} has been updated`);
};