const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { BadRequest } = require('../errors/Bad-Request');
const { NotFound } = require('../errors/NotFound');
const { ConflictError } = require('../errors/ConflictError');

const getUser = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};
const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NOT_FOUND');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NOT_FOUND') {
        next(new NotFound('Пользователь по указанному id не найден'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Неверный формат id'));
      }
      next(err);
    });
};
const getInfoAboutUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь по указанному id не найден');
      }
      res.send({ data: user });
    })
    .catch((err) => next(err));
};
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.send({
      data: {
        name,
        about,
        avatar,
        email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с такими данными уже существует'));
      }
      next(err);
    });
};
const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NOT_FOUND');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'NOT_FOUND') {
        next(new NotFound('Пользователь с указанным id не найден'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
      }
      next(err);
    });
};
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NOT_FOUND');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'NOT_FOUND') {
        next(new NotFound('Пользователь с указанным id не найден'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
      }
      next(err);
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24,
        httpOnly: true,
      })
        .send({ token });
    })
    .catch((err) => next(err));
};

module.exports = {
  getUser,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
  getInfoAboutUser,
};
