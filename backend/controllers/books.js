const Book = require('../models/book');
const Rating = require('../models/book');
const fs = require('fs');
const average = require ('../average')

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  book.save()
  .then(() => res.status(201).json({ message: 'Livre modifié !'}))
  .catch(error => res.status(400).json({ error }));
}

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({ error }));
};

exports.rateBook = (req, res, next) => {
  /* const rating = new Rating({
    ...req.body,
    grade: req.body.rating
  });
  delete rating._id;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if ( req.body.rating < 0 && req.body.rating > 5 ){
        res.status(403).json({ message: 'Not authorized'});
      } else {
        const bookObject = book;
        Rating.find()
        .then((ratings) => {
        ratings.push(rating);
        let sum = 0;
        ratings.grade.forEach( rating => {
          sum+= rating;
        });
        averageRating = sum / ratings.lenght;
        Book.updateOne({_id: req.params.id}, { ...bookObject, _id: req.params.id})
        .then((book) => res.status(201).json({ book }))
        .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(400).json({ error }))
      }
    })
    .catch(error => res.status(400).json({ error }));
    */
       // On vérifie que la note est comprise entre 0 et 5
       if (0 <= req.body.rating <= 5) {
        // Stockage de la requête dans une constante

    const ratingObject = { ...req.body, grade: req.body.rating };
        // Suppression du faux _id envoyé par le front
        delete ratingObject._id;
        // Récupération du livre auquel on veut ajouter une note
        Book.findOne({_id: req.params.id})
            .then(book => {
                // Création d'un tableau regroupant toutes les userId des utilisateurs ayant déjà noté le livre en question
                const newRatings = book.ratings;
                const userIdArray = newRatings.map(rating => rating.userId);
                // On vérifie que l'utilisateur authentifié n'a jamais donné de note au livre en question
                if (userIdArray.includes(req.auth.userId)) {
                    res.status(403).json({ message : 'Not authorized' });
                } else {
                    // Ajout de la note
                    newRatings.push(ratingObject);
                    // Création d'un tableau regroupant toutes les notes du livre, et calcul de la moyenne des notes
                    const grades = newRatings.map(rating => rating.grade);
                    const averageGrades = average.average(grades);
                    book.averageRating = averageGrades;
                    // Mise à jour du livre avec la nouvelle note ainsi que la nouvelle moyenne des notes
                    Book.updateOne({ _id: req.params.id }, { ratings: newRatings, averageRating: averageGrades, _id: req.params.id })
                        .then(() => { res.status(201).json()})
                        .catch(error => { res.status(400).json( { error })});
                    res.status(200).json(book);
                }
            })
            .catch((error) => {
                res.status(404).json({ error });
            });
    } else {
        res.status(400).json({ message: 'La note doit être comprise entre 1 et 5' });
    }
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};

    delete bookObject._userId;
    Book.findOne({_id: req.params.id})
      .then((book) => {
        if (book.userId != req.auth.userId) {
          res.status(403).json({ message: 'Not authorized'});
        } else {
          Book.updateOne({_id: req.params.id}, { ...bookObject, _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Livre modifié!'}))
            .catch(error => res.status(401).json({ error }));
        }
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
};
 
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
    .then(book => {
        if (book.userId != req.auth.userId) {
          res.status(401).json({ message: 'Not Authorized'});
        } else {
          const filename = book.imageUrl.split('/images')[1];
          fs.unlink(`images/${filename}`, () => {
              Book.deleteOne({ _id: req.params.id})
              .then(() => res.status(200).json({ message: 'Livre supprimé'}))
              .catch(error => res.status(401).json({ error }));
          });
        }
    })
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