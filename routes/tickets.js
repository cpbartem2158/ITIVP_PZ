const express = require('express');
const { requireAuth } = require('../middleware/auth');
const ticketsController = require('../controllers/ticketsController');

const router = express.Router();

router.get('/', ticketsController.list);
router.get('/login', ticketsController.login);
router.get('/item/:id', ticketsController.show);
router.get('/add', requireAuth, ticketsController.showAddForm);
router.post('/add', requireAuth, ticketsController.create);

module.exports = router;
