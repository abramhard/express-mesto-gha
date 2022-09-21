const router = require('express').Router();
const {
  getUser, getUserById, createUser, updateUserInfo, updateAvatar,
} = require('../controllers/Users');

router.get('/', getUser);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
