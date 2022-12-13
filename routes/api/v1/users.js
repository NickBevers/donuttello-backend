// Define imports
const express = require('express');
const router = express.Router();
const userController = require('../../../controllers/userController');
const authenticate = require('../../../middleware/authenticate');

/* GET users listing. */
router.get('/', userController.getAll);
router.get('/auth', authenticate, userController.authenticate);
router.get('/:id', userController.getOne);

/* POST register and login */
// router.post('/register', userController.create); // ← This is the route for rehistering a new user (temp route only for dev purposes)
router.post('/login', userController.login);
router.post('/resetpassword', authenticate, userController.resetPassword);

/* DELETE remove user */
// router.delete('/:id', userController.remove);

module.exports = router;
