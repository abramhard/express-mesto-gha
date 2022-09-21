const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRouter = require('./routes/Users');
const cardRouter = require('./routes/cards');
const { BAD_REQUEST } = require('./errors/errors');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '632ae438f89312d095be29c5',
  };

  next();
});
app.use(express.json());
app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req, res) => {
  res.status(BAD_REQUEST).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Сервер запущен на порту: ${PORT}`);
});
