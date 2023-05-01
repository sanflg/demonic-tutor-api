import { v4 as uuidv4 } from 'uuid';
import { mongoose, Schema } from 'mongoose';

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