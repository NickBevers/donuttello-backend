const mongoose = require('mongoose');
const donutSchema = new mongoose.Schema({
    base: {String, required: true},
    frosting: {String, required: true},
    sprinkles: {String, required: true},
    name: {String, required: true},
    email: {String, required: true}
})

const Donut = mongoose.model('Donut', donutSchema);
module.exports = Donut;