const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const testController = require('../controllers/apptest');

router.get('/app', testController.getData);
router.post('/app', testController.postData);

module.exports = router;