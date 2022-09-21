const User = require('../models/user');

const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../errors/errors');

const getUser = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Неожиданная ошибка' });
    });
};
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('Пользователь по указанному id не найден');
    })
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      if (err.statusCode === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Неверный формат id' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Неожиданная ошибка' });
      }
    });
};
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(() => res.status(200).send({ name, about, avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Неожиданная ошибка' });
      }
    });
};
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Неожиданная ошибка' });
      }
    });
};
const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else if (err.name === 'CastError') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным id не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Неожиданная ошибка' });
      }
    });
};

module.exports = {
  getUser,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
};
