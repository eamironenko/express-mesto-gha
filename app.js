const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { notFoundPage } = require('./errors/error');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/mestodb');

// не требуют авторизации
app.post('/signin', login);
app.post('/signup', createUser);
// авторизация
app.use(auth);
// роуты требуют авторизации
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  res.status(notFoundPage.errorCode).send({ message: notFoundPage.message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
