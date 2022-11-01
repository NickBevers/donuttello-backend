const mongoose = require('mongoose');
const donutSchema = new mongoose.Schema({
    base: {type: String, required: true},
    frosting: {type: String, required: true},
    sprinkles: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    hasBeenProduced: { type: Boolean, default: false, required: false },
    votes: { type: Number, default: 0, required: false },
    dateCreated: { type: Date, default: Date.now, required: false }
})

const Donut = mongoose.model('Donut', donutSchema);
module.exports = Donut;