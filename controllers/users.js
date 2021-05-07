const { Error } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SOLT_ROUNDS = 10;
const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getUserById = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .orFail(new Error('NotValid'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotValid') {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Введите корректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: 'Не передан email или пароль' });
  }
  bcrypt.hash(req.body.password, SOLT_ROUNDS)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        res.status(409).send({ message: 'Пользователь с переданный email уже существует' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Введите корректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' });
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

    },
  ).then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Введите корректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
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

    },
  ).then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Введите корректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });

      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // аутентификация успешна
      res.send({ message: 'Вход выполнен' });
    })
    .catch((err) => {
      res.status(401).send({ message: 'Неправильные почта или пароль' });
    });
};

module.exports = {
  getUsers, createUser, getUserById, updateUser, updateAvatar, login,
};
