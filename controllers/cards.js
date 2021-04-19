const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Введите корректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findOneAndDelete({ _id: req.params.cardId })
    .orFail(new Error('NotValid'))
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.message === 'NotValid') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Введите корректные данные' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('NotValid'))
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.message === 'NotValid') {
      res.status(404).send({ message: 'Карточка с указанным id не найдена' });
    } else if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ message: 'Введите корректные данные' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка' });
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail(new Error('NotValid'))
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.message === 'NotValid') {
      res.status(404).send({ message: 'Карточка с указанным id не найдена' });
    } else if (err.name === 'ValidationError' || err.name === 'CastError') {
      res.status(400).send({ message: 'Введите корректные данные' });
    } else {
      res.status(500).send({ message: 'Произошла ошибка' });
    }
  });

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
