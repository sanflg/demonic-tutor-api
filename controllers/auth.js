import { logRequest, logResponse } from '../controllers/baseController.js';
import { User } from '../models/User.js';

const serv = "Auth";

export const Register = async (req, res) => {
    const user = new User({
        userName: req.body.userName,
        tag: req.body.tag,
        email: req.body.email,
        password: req.body.password,
        birthDate: req.body.birthDate
    });
    console.log(user);
    try {
        const savedUser = await user.save({ validateBeforeSave: false });
        res.send(savedUser);
    } catch (error) {
        res.status(400).json({ error })
    }
};

export const Delete = async (req, res) => {
    const { id } = req.params;
    const query = { id: id };
    console.log(req.params);
    try {
        await User.deleteOne(query);
        res.send(deleteUser);
    } catch (error) {
        res.status(400).json({ error })
    }
};