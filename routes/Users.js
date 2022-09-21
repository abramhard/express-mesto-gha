const router = require('express').Router();
const {
  getUser, getUserById, createUser, updateUserInfo, updateAvatar,
} = require('../controllers/Users');

router.get('/users', getUser);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
