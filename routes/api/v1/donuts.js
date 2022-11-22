// Define imports
const express = require('express');
const router = express.Router();
const donutController = require('../../../controllers/donutController');
const authenticate = require('../../../middleware/authenticate');

// GET all donuts (only for admin with correct token)
router.get('/', authenticate, donutController.getAll);

// GET a single donut by id
router.get('/:id', donutController.getOne);

// POST a new donut
router.post('/', donutController.create);

// PUT (update) a donut
router.put('/:id', donutController.update);

// DELETE a donut (only for admin with correct token)
router.delete('/:id', authenticate, donutController.remove);

module.exports = router;