const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.get('/logout', authController.logout);

router.get('/configure', authController.getPage);
router.post('/configure', [
        body('email').isEmail()
        .withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) return Promise.reject('Email address already Exists');
            })
        })
        .normalizeEmail(),

        body('id')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Your ID must be alphanumeric and minimum of 5 characters')
        .isAlphanumeric()
        .custom((value, { req }) => {
            return User.findOne({ id: value }).then(user => {
                if (user) return Promise.reject('ID already Exists');
            })
        }),

        body('format')
        .not()
        .isEmpty()
        .withMessage('Please select a format')
    ],
    authController.configure
);

module.exports = router;