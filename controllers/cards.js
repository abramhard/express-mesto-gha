const Card = require('../models/card');

const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Неожиданная ошибка' });
    });
};
const createCard = (req, res) => {
  const { name, link } = req.body;
  const { owner } = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Неожиданная ошибка' });
      }
    });
};
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      res.status(NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Неожиданная ошибка' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      res.status(NOT_FOUND).send({ message: 'Передан несуществующий id карточки' });
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Неожиданная ошибка' });
      }
    });
};
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      res.status(NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Неожиданная ошибка' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  likeCard,
  dislikeCard,
  deleteCard,
};
