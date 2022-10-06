const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const userRouter = require('./routes/Users');
const cardRouter = require('./routes/cards');
const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/Users');
const NotFound = require('./errors/NotFound');
const { validateUserBody, validateAuthentication } = require('./routes/index');
const internalError = require('./middlewares/internalError');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signup', validateUserBody, createUser);
app.post('/signin', validateAuthentication, login);

app.use('/users', auth, userRouter);
app.use('/', auth, cardRouter);

app.use('*', auth, (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});
app.use(errors());
app.use(internalError);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен на порту: ${PORT}`);
});
