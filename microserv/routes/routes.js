const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const testController = require('../controllers/apptest');
const homeController = require('../controllers/homeController');
const isAuth = require('../middleware/is-auth');

//router.get('/');
router.get('/', homeController.display);
router.get('/app', isAuth, testController.getData);
router.post('/app', isAuth, [
        body('url')
        .isURL()
        .withMessage('Please Enter a valid Url')
    ],
    testController.postData
);
router.get('/app/urls/:id', isAuth, testController.getSingleData);
router.get('/app/urls/:id/delete', isAuth, testController.deleteSingleData);
router.get('/app/urls/:id/edit', isAuth, testController.postEditSingleData);

module.exports = router;