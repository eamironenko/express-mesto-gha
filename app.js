const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users');
const NotFoundPage = require('./errors/NotFoundPage');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/mestodb');

// не требуют авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    avatar: Joi.string().pattern(/^(http|https|ftp|):\/\/|(?:\S+(?::\S*)?@)|[a-zA-Z0-9\-\\.]+\.[a-zA-Z](:[a-zA-Z0-9]*)?\/?([\w#!:.?+=&%@!\-/])*[^\s]$/i),
  }),
}), createUser);

// роуты требуют авторизации
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', auth, () => {
  throw new NotFoundPage('Страница не найдена');
});

app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
