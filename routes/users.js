const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const {
  getUsers, getUserId, getUserCurrent, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/', auth, getUsers);
router.get('/me', auth, getUserCurrent);

router.get('/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserId);

router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(http|https|ftp|):\/\/|[a-zA-Z0-9\-\\.]+\.[a-zA-Z](:[a-zA-Z0-9]*)?\/?([\w#!:.?+=&%@!\-/])*[^\s]$/g),
  }),
}), updateUserAvatar);

module.exports = router;
