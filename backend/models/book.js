const mongoose = require('mongoose');

/* const ratingSchema = mongoose.Schema({
  userId: { type: String, required: true },
  grade: { type: Number, required: true }
}) */

const bookSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true},
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  ratings: /* [ratingSchema]*/ [{
    userId: { type: String },
    grade: { type: Number },
}],
  averageRating: { type: Number, required: true },
});

module.exports = mongoose.model('Book', bookSchema);
// module.exports = mongoose.model('Rating', ratingSchema);