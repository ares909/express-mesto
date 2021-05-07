const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');
const auth = require('./middlewares/auth');
const {
  createUser, login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb2', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
// app.use((req, res, next) => {
//   req.user = {
//     _id: '6077f30ddcccb6614c1c2e8f',
//   };

//   next();
// });

app.use('/users', auth, users);
app.use('/cards', cards);
app.use('/signin', login);
app.use('/signup', createUser);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

//
