const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundPage = require('../errors/NotFoundPage');
const Validation = require('../errors/Validation');
const UniqueErr = require('../errors/UniqueErr');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserCurrent = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundPage('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFoundPage('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Validation('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
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
      if (err.name === 'Validation') {
        if (err.message.includes('unique')) {
          return next(new UniqueErr(err.message.replace('user validation failed:', 'пользователь не создан')));
        }
        return next(new Validation(err.message.replace('user validation failed:', 'пользователь не создан')));
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFoundPage('Пользователь не найден');
      }
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'Validation') {
        return next(new Validation(err.message));
      }
      return next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFoundPage('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'Validation') {
        return next(new Validation(err.message));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
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
    .catch(next);
};
