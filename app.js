const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use((req, res, next) => {
  req.user = {
    _id: '6077f30ddcccb6614c1c2e8f',
  };

  next();
});

app.use('/users', users);
app.use('/cards', cards);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

//
