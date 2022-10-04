const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const { regex } = require('../utils/regex');
const {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regex),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardid: Joi.string().required().hex().length(24),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardid: Joi.string().required().hex().length(24),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardid: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
