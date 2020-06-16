const Traffic = require('../models/data');
const appControls = require('../controllers/apptest');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwtExpirySeconds = 3600;
const jwtSecretKey = 'somesupersecretsecret';

exports.postLogin = (req, res, next) => {
    const id = req.body.id;
    User.findOne({ id: id }).then(user => {
        if (!user) {
            const error = new Error('A user with this id was not found');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            Id: user.id,
            userId: user._id.toString()
        }, jwtSecretKey, {
            expiresIn: jwtExpirySeconds
        });

        res.cookie('token', token, {
            maxAge: jwtExpirySeconds * 1000,
            secure: false,
            httpOnly: true
        });
        res.status(200).json({ token: token, userId: user.id });

    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.configure = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const email = req.body.email;
    const id = req.body.id;
    const format = req.body.format;

    const user = new User({
        id: id,
        email: email,
        format: format
    });

    return user.save().then(result => {
            res.status(201).json({ message: 'User Created', userId: result._id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getUrls = (req, res, next) => {
    Traffic.find().then(data => {
        res.status(200).json({
            message: 'Data fetched successfully',
            data: data
        })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.getUrl = (req, res, next) => {
    Traffic.findOne({ url: req.params.url }).then(data => {
        let dataJson;
        let message = 'Sorry Url does not exist';

        if (data) {
            dataJson = data.toJSON();
            delete dataJson.__v;
            message = 'Data Fetched successfully';
        }

        return res.status(200).json({
            message: message,
            data: dataJson
        });

    }).catch(err => console.log(err));
};

exports.postData = (req, res, next) => {
    let userC;
    const url = req.body.url;
    const findByUrl = Traffic.findOne({ url: url });
    const find = Traffic.find();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation Error. Data entered is incorrect')
        error.statusCode = 422;
        throw error;
    }

    findByUrl.then(info => {
        console.log(info)
        if (!info) {
            appControls.getValueFunc(url).then(data => {
                if (data !== 'No Data') {
                    const viewsPerMillion = data.PageViews.PerMillion;
                    const viewsPerUser = data.PageViews.PerUser
                    const traffic = new Traffic({
                        title: 'PageUrl',
                        url: url,
                        perUser: Number(viewsPerUser),
                        perMillion: Number(viewsPerMillion),
                        user: req.userId
                    });
                    traffic.save().then(result => {
                            return User.findById(req.userId);
                        })
                        .then(user => {
                            userC = user;
                            user.urls.push(traffic);
                            user.save()
                        })
                        .then(result => {
                            return res.status(201).json({
                                message: 'Data created successfully!',
                                url: traffic,
                                user: {
                                    id: userC.id
                                }
                            });
                        }).catch(err => {
                            if (!err.statusCode) {
                                err.statusCode = 500;
                            }
                            next(err);
                        });
                } else {
                    const error = new Error('There is a problem with that url')
                    error.statusCode = 422;
                    throw error;
                }
            });
        } else {
            info.url = url;
            if (info.user.toString() !== req.userId) {
                const error = new error('Not authorized to edit that url');
                error.statusCode = 403;
                throw error;
            } else {
                return info.save()
                    .then(result => {
                        let dataJson = result.toJSON();
                        delete dataJson.__v;
                        res.status(200).json({
                            message: 'Post updated successfully',
                            data: dataJson
                        })
                    })
            }

        }
    })
}

exports.deleteUrl = (req, res, next) => {
    const url = req.params.url;
    Traffic.findOne({ url: url }).then(data => {
        if (!data) {
            const error = new Error('Url already exists')
            error.statusCode = 422;
            throw error;
        }
        const id = data._id;
        return Traffic.findByIdAndRemove(id)
    }).then(result => {
        let dataJson = result.toJSON();
        delete dataJson.__v;
        res.status(200).json({
            message: 'Data deleted successfully',
            data: dataJson
        })
    })
}