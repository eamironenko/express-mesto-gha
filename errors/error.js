class Error {
  constructor({ message, name, errorCode }) {
    this.message = message;
    this.name = name;
    this.errorCode = errorCode;
  }
}

const validationError = new Error({
  message: 'переданы некорректные данные в методы создания карточки, пользователя, обновления аватара пользователя или профиля',
  name: 'validationError',
  errorCode: '400',
});

const notFoundPage = new Error({
  message: 'страница не найдена',
  name: 'notFoundPage',
  errorCode: '404',
});

const notFoundId = new Error({
  message: 'карточка или пользователь не найден',
  name: 'notFoundId',
  errorCode: '404',
});

const defaultError = new Error({
  message: 'что-то пошло не так',
  name: 'something wrong',
  errorCode: '500',
});

module.exports = {
  validationError, notFoundPage, notFoundId, defaultError,
};
