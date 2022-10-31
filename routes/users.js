const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', userController.getAll);
router.get('/:id', userController.getOne);

/* POST register and login */
router.post('/register', userController.create);
router.post('/login', userController.login);

/* DELETE remove user */
router.delete('/:id', userController.remove);

module.exports = router;
