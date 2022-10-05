/* eslint-disable no-else-return */
const Card = require('../models/card');

const { BadRequest } = require('../errors/Bad-Request');
const { NotFound } = require('../errors/NotFound');
const { ForbiddenError } = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new Error('NOT_FOUND');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        next(new NotFound('Передан несуществующий id карточки'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки лайка'));
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new Error('NOT_FOUND');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        next(new NotFound('Передан несуществующий id карточки'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для снятия лайка'));
      }
      next(err);
    });
};
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NOT_FOUND');
    })
    .then((card) => {
      if (card.owner.toString() === req.user._id.toString()) {
        return card.remove();
      } else {
        return next(new ForbiddenError('Вы не можете удалить эту карточку'));
      }
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        next(new NotFound('Карточка с указанным id не найдена'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};
