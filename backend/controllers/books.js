const Book = require('../models/book');

exports.createBook = (req, res, next) => {
    const book = new Book({
        userId: req.body.userId,
        title: req.body.title,
        author: req.body.author,
        imageUrl: req.body.imageUrl,
        year: req.body.year,
        genre: req.body.genre,
        ratings: [
            { userId: req.body.ratings.userId,
              grade: req.body.ratings.grade
            },
        ],
        averageRating: req.body.averageRating
    });
    book.save()
      .then(() => res.status(201).json({ message: 'Livre enregistré !'}))
      .catch(error => res.status(400).json({ error }));
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
};

exports.modifyBook = (req, res, next) => {
    const book = new Book({
        _id: req.params.id,
        userId: req.body.userId,
        title: req.body.title,
        author: req.body.author,
        imageUrl: req.body.imageUrl,
        year: req.body.year,
        genre: req.body.genre,
        ratings: [
            { userId: req.body.ratings.userId,
              grade: req.body.ratings.grade
            },
        ],
        averageRating: req.body.averageRating
    });
    Book.updateOne({ _id: req.params.id }, book)
    .then(() => res.status(200).json({ message: 'Livre modifié !'}))
    .catch(error => res.status(400).json({ error }));
};
 
exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllBooks = (req, res, next) => {
    Book.find().then(
      (books) => {
        res.status(200).json(books);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };