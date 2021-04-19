const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    // .populate('card')
    .then((users) => res.send(users))
    .catch(() => res.status(500).send('Произошла ошибка'));
};

const getUserById = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send('Запрашиваемый пользователь не найден');
      } else {
        res.status(500).send('Произошла ошибка');
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send('Введите корректные данные');
      } else {
        res.status(500).send('Произошла ошибка');
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name, about },

    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  ).then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send('Введите корректные данные');
      } else if (err.name === 'CastError') {
        res.status(404).send('Запрашиваемый пользователь не найден');
      } else {
        res.status(500).send('Произошла ошибка');
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { avatar },

    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  ).then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send('Введите корректные данные');
      } else if (err.name === 'CastError') {
        res.status(404).send('Запрашиваемый пользователь не найден');
      } else {
        res.status(500).send('Произошла ошибка');
      }
    });
};

module.exports = {
  getUsers, createUser, getUserById, updateUser, updateAvatar,
};
