const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { notFoundId, defaultError, validationError } = require('../errors/error');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(defaultError.errorCode).send({ message: defaultError.message }));
};

module.exports.getUserCurrent = (req, res) => {
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
        res.status(validationError.errorCode).send({ message: validationError.message });
      } else {
        res.status(defaultError.errorCode).send({ message: defaultError.message });
      }
    });
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
        res.status(validationError.errorCode).send({ message: validationError.message });
      } else {
        res.status(defaultError.errorCode).send({ message: defaultError.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      password: user.password,
      _id: user._id,
    }))
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создаем токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
      res.cookie('jwt', token, {
        maxAge: 3600 * 24 * 7,
        httpOnly: true,
      }).end();
    })
    .catch((err) => { // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};
