const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers, getUserId, getUserCurrent, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/', auth, getUsers);
router.get ('/me', auth, getUserCurrent);
router.get('/:userId', auth, getUserId);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
