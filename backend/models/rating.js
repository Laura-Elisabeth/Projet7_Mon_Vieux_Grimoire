const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const uniqueValidator = require('mongoose-unique-validator');

const ratingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    grade: { type: Number, required: true }
});

ratingSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Rating', ratingSchema);