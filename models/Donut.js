// Define imports
const mongoose = require('mongoose');

// Define schema (what properties does a donut order have?)
const donutSchema = new mongoose.Schema({
    glaze: {type: String, default: "", required: true},
    filling: {type: String, default: "", required: true},
    topping1: {type: String, default: "", required: true},
    topping2: {type: String, default: "", required: true},
    logo: {type: String, default: "", required: false},
    name: {type: String, required: false},
    company: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    orderStatus: { type: String, default: "ordered", required: true },
    dateCreated: { type: Date, default: Date.now, required: false }
})

// Connect the schema to the collection in the db
const Donut = mongoose.model('Donut', donutSchema);

module.exports = Donut;