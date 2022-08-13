const router = require('express').Router;
const {
  getUsers, getUserId, createUser, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/', getUserId);
router.post('/', createUser);
router.patch('/', updateUser);
router.patch('/', updateUserAvatar);

module.exports = router;
