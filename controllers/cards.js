const Card = require('../models/card');
const { validationError, notFoundId, defaultError } = require('../errors/error');

// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(defaultError.errorCode).send({ message: defaultError.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationError.errorCode).send({ message: validationError.message });
      } else {
        res.status(defaultError.errorCode).send({ message: defaultError.message });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(notFoundId.errorCode).send({ message: notFoundId.message });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(validationError.errorCode).send({ message: validationError.message });
      } else {
        res.status(defaultError.errorCode).send({ message: defaultError.message });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(notFoundId.errorCode).send({ message: notFoundId.message });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(validationError.errorCode).send({ message: validationError.message });
      } else {
        res.status(defaultError.errorCode).send({ message: defaultError.message });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        res.status(notFoundId.errorCode).send({ message: notFoundId.message });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(validationError.errorCode).send({ message: defaultError.message });
      } else {
        res.status(defaultError.errorCode).send({ message: defaultError.message });
      }
    });
};
