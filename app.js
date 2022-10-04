const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const mongoose = require('mongoose');
const userRouter = require('./routes/Users');
const cardRouter = require('./routes/cards');
const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/Users');
const { NotFound } = require('./errors/NotFound');
const { regex } = require('./utils/regex');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regex),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use('*', (req, res) => {
  res.status(NotFound).send({ message: 'Страница не найдена' });
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Ошибка на сервере'
      : message,
  });
  next();
});
app.use(errors());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен на порту: ${PORT}`);
});
