const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use('/', usersRoutes);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

//
