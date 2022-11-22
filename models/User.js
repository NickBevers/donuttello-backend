// Define imports
const mongoose = require('mongoose');

// Define schema (what properties does a user have?)
const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now, required: false },
    type: { type: String, default: "user" }
});

// Connect the schema to the collection in the db
const User = mongoose.model('User', userSchema);

module.exports = User;