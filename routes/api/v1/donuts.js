const express = require('express');
const router = express.Router();
const donutController = require('../../../controllers/donutController');

/* GET donuts */
router.get('/', donutController.getAll);
router.get('/:id', donutController.getOne);

/* POST new donut */
router.post('/', donutController.create);

/* PUT update donut */
router.put('/:id', donutController.update);

/* DELETE donut */
router.delete('/:id', donutController.remove);

module.exports = router;