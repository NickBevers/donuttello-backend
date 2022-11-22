// Define imports
const mongoose = require('mongoose');

// Define schema (what properties does a donut order have?)
const donutSchema = new mongoose.Schema({
    base: {type: String, required: true},
    frosting: {type: String, required: true},
    toppings: {type: String, required: true},
    name: {type: String, required: false},
    email: {type: String, required: true},
    hasBeenProduced: { type: Boolean, default: false, required: false },
    votes: { type: Number, default: 0, required: false },
    dateCreated: { type: Date, default: Date.now, required: false }
})

// Connect the schema to the collection in the db
const Donut = mongoose.model('Donut', donutSchema);

module.exports = Donut;