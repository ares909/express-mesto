const router = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUser, updateAvatar, login
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
// router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);
router.post('/signin', login);
router.post('/signup', createUser);

module.exports = router;
