const Card = require('../models/card');
const Validation = require('../errors/Validation');
const NotFoundPage = require('../errors/NotFoundPage');
const DeleteErr = require('../errors/DeleteErr');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'Validation') {
        return next(new Validation(err.message));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundPage('Карточка не найдена');
      }
      const cardOwner = card.owner.toString();
      if (cardOwner !== req.user._id) {
        throw new DeleteErr('Карточку Нельзя удалить');
      }
    });
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Validation('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        throw new NotFoundPage('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Validation('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send({ data: card });
      } else {
        throw new NotFoundPage('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Validation('Переданы некорректные данные'));
      }
      return next(err);
    });
};
