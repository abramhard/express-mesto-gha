const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { regex } = require('../utils/regex');
const {
  getUser, getUserById, updateUserInfo, updateAvatar, getInfoAboutUser,
} = require('../controllers/Users');

router.get('/', getUser);
router.get('/me', getInfoAboutUser);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regex),
  }),
}), updateAvatar);

module.exports = router;
