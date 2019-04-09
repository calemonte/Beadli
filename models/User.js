const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String, 
        required: true, 
        unique: true, 
        min: [4, 'Username must at least 4 characters'], 
        max: [16, 'Username can not exceed 16 characters'], 
        match: [/^A-Za-z0-9/, 'Username can only contain letters and numbers']
    },
    password: {
        type: String,
        required: true,
        min: [8, 'Password must be at least 8 characters'],
        max: [16, 'Password can not exceed 16 characters']
    },
    email: {
        type: String,
        required: true,
        match: [/.+@.\..+/, 'Please enter a valid email address']
    },
    designs: {
        type: Array
    },
    favorites: {
        type: Array
    },
    avatar: {
        type: String
    },
    background: {
        type: String
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;