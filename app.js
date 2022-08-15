const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { notFoundPage } = require('./errors/error');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '62f904ca6a6d7288d865e776', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  res.status(notFoundPage.errorCode).send({ message: notFoundPage.message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
