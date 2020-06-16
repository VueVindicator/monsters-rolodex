const { getCred, callAwis } = require('../urlinfo');
const { validationResult } = require('express-validator');
const Traffic = require('../models/data');
const User = require('../models/user');
const mongoose = require('mongoose');
//const fetch = require('node-fetch');

const global_email = 'david.ajayi.anu@gmail.com'

let apiKey = 'wQDQtNH6wx5ck2x0yp3sg7zotJntxPIKvFHciZL4';
let site = 'www.google.com';

const getValues = (url) => {
    return new Promise((res, rej) => {
        getCred(global_email)
            .then(function(awsCredentials) {
                callAwis(awsCredentials, apiKey, url)
                    .then((html) => {
                        const hold = JSON.parse(JSON.stringify(html))
                        const hold1 = hold.Awis.Results.Result.Alexa.TrafficHistory.HistoricalData;

                        if (hold1 != null) {
                            const dataRet = hold1.Data;
                            res(dataRet);
                        } else res('No Data');

                    })
            })
            .catch((e) => console.log(e))
    })
}

exports.getValueFunc = getValues;

exports.postData = (req, res, next) => {
    let userC;
    const url = req.body.url;
    const findByUrl = Traffic.find({ url: url });
    const find = Traffic.find();
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        find.then((data) => {
            res.render('app/home', {
                info: data,
                errorMessage: errors.array()[0].msg,
                user: req.userId
            });
        }).catch(err => console.log(err));
    } else {
        findByUrl.then(info => {
            if (info.length == 0) {
                getValues(url).then(data => {
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
                        traffic.save()
                            .then(result => {
                                return User.findById(req.userId);
                            })
                            .then(user => {
                                userC = user;
                                user.urls.push(traffic);
                                return user.save();
                            })
                            .then(result => {
                                res.redirect('/app');
                            })

                    } else {
                        find.then(info => {
                            res.render('app/home', {
                                info: info,
                                errorMessage: 'There is a problem with the Url. It\'s Either it does not exist or is down',
                                user: req.userId
                            })
                        })
                    }
                })
            } else {
                find.then(info => {
                    res.render('app/home', {
                        info: info,
                        errorMessage: 'That Url has already been entered',
                        user: req.userId
                    })
                })
            }
        })
    }
}
exports.getData = (req, res, next) => {
    let TrafficData;
    Traffic.find().then((data) => {
        TrafficData = data;
        res.render('app/home', {
            info: TrafficData ? TrafficData : [],
            errorMessage: '',
            user: req.userId
        });
    }).catch(err => console.log(err));
}

exports.getSingleData = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    const edit = req.query.edit;
    Traffic.findById(id).then(data => {
        res.render('app/url/show', {
            info: data,
            edit: edit
        })
    })
}

exports.deleteSingleData = (req, res, next) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    Traffic.findByIdAndRemove(id).then(data => {
        res.redirect('/app');
    })
}

exports.postEditSingleData = (req, res, next) => {
    //
}

const setUpQuery = () => {

}