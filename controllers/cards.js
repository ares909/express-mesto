const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send('Произошла ошибка'));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send('Введите корректные данные');
      } else {
        res.status(500).send('Произошла ошибка');
      }
    });
};

const deleteCard = (req, res) => {
  Card.findOneAndDelete({ _id: req.params.cardId })
    .then(() => res.send('Карточка удалена'))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send('Карточка с указанным _id не найдена');
      }
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send('Введите корректные данные');
    } else {
      res.status(500).send('Произошла ошибка');
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send('Введите корректные данные');
    } else {
      res.status(500).send('Произошла ошибка');
    }
  });

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
