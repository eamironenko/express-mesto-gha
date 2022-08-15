const { notFoundId, defaultError, validationError } = require('../errors/error');
const User = require('../models/user');

// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(defaultError.errorCode).send({ message: defaultError.message }));
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
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

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationError.errorCode).send({ message: validationError.message });
      } else {
        res.status(defaultError.errorCode).send({ message: defaultError.message });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        res.status(notFoundId.errorCode).send({ message: notFoundId.message });
      }
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationError.errorCode).send({ message: validationError.message });
      } else {
        res.status(defaultError.errorCode).send({ message: defaultError.message });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        res.status(notFoundId.errorCode).send({ message: notFoundId.message });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationError.errorCode).send({ message: validationError.message });
      } else {
        res.status(defaultError.errorCode).send({ message: defaultError.message });
      }
    });
};
