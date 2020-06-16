const { validationResult } = require('express-validator');
//const toastr = require('../toastr');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const jwtExpirySeconds = 3600;
const jwtSecretKey = 'somesupersecretsecret';

// const showToaster = (message) => {
//     toastr.warning(message);
// }

exports.logout = (req, res, next) => {
    req.userId = '';

    res.cookie('token', '');

    console.log(req.userId)
    res.redirect('/login');
    next();
}

exports.getPage = (req, res, next) => {

    const tokenF = req.cookies.token || '';

    if (tokenF) {
        return res.redirect('/app');
    }

    res.render('app/auth/register', {
        errorMessage: '',
        data: {
            email: '',
            id: '',
        }
    })
}

exports.configure = (req, res, next) => {

    const errors = validationResult(req);
    const email = req.body.email;
    const id = req.body.id;
    const format = req.body.format;

    if (!errors.isEmpty()) {
        return res.render('app/auth/register', {
            errorMessage: errors.array(),
            data: {
                email: email,
                id: id
            }
        })
    }

    const user = new User({
        id: id,
        email: email,
        format: format
    });

    const token = jwt.sign({
        id: user.id,
        userId: user._id.toString()
    }, jwtSecretKey, {
        expiresIn: jwtExpirySeconds,
    });

    res.cookie('token', token, {
        maxAge: jwtExpirySeconds * 1000,
        secure: false,
        httpOnly: true
    });

    return user.save().then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getLogin = (req, res, next) => {
    const token = req.cookies.token || '';
    if (!token) {
        res.render('app/auth/login', {
            errorMessage: '',
            data: {
                id: ''
            }
        })
    } else {
        res.redirect('/app');
    }
    next();
}

exports.postLogin = (req, res, next) => {
    const id = req.body.id;
    const errors = validationResult(req);
    User.findOne({ id: id }).then(user => {
        if (!user) {
            return res.render('app/auth/login', {
                errorMessage: [{ 'msg': 'That ID was not found' }],
                data: {
                    id: id
                }
            })
        }

        const token = jwt.sign({
            id: user.id,
            userId: user._id.toString()
        }, jwtSecretKey, {
            expiresIn: jwtExpirySeconds,
        });

        res.cookie('token', token, {
            maxAge: jwtExpirySeconds * 1000,
            secure: false,
            httpOnly: true
        });

        res.redirect('/app');

    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}