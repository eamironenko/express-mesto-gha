const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // достаем авторизованный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с bearer
  if (!authorization || !authorization.startsWith('Bearer')) {
    return res
      .status(401)
      .send({ message: 'необходима авторизация'});
  }
  // извлечем токен
  const token = authorization.replace('Bearer', '');
  let playload;
  // верифицируем токен
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'необходима авторизация'});
  }
  req.user = playload;
  next();
};
