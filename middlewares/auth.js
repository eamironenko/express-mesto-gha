const jwt = require('jsonwebtoken');
const AuthErr = require('../errors/AuthErr');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с bearer
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AuthErr('Необходима авторизация');
  }
  // извлечем токен
  const token = authorization.replace('Bearer', '');
  let payload;

  // верифицируем токен
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new AuthErr('Необходима авторизация');
  }
  req.user = payload;
  next();
  return req.user;
};
