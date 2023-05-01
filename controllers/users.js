import { v4 as uuidv4 } from 'uuid';
import { logRequest, logResponse } from '../controllers/baseController.js';

let users = [];
const serv = "Users";

export const getUsers = (req, res) => {
    logRequest(serv, "getUsers");
    logResponse(users, res);
};

export const createUser = (req, res) => {
    const user = req.body;
    logRequest(serv, "createUser", user);
    users.push({ id: uuidv4(), ...user });
    logResponse(`User with username "${user.userName}" created.`, res);
};

export const getUser = (req, res) => {
    const id = req.params.id;
    logRequest(serv, "getUser", id);
    const foundUser = users.find((user) => user.id === id);
    logResponse(foundUser, res);
};

export const deleteUser = (req, res) => {
    const { id } = req.params;
    logRequest(serv, "deleteUser", id);
    users = users.filter((user) => user.id !== id);
    logResponse(`User with id "${id}" deleted.`, res);
};

export const patchUser = (req, res) => {
    logRequest(serv, "patchUser", req.body);
    const { id } = req.params;
    const { userName, mail, password, birthDate, userTag } = req.body;
    const user = users.find((user) => user.id === id);

    if (userName) user.userName = userName;
    if (mail) user.mail = mail;
    if (password) user.password = password;
    if (birthDate) user.birthDate = birthDate;
    if (userTag) user.userTag = userTag;
    logResponse(`User with id ${id} has been updated`, res);
};