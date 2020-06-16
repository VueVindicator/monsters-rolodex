const { getCred, callAwis } = require('../urlinfo');
const global_email = 'david.ajayi.anu@gmail.com'
let dataRet;
//const fetch = require('node-fetch');

let apiKey = 'wQDQtNH6wx5ck2x0yp3sg7zotJntxPIKvFHciZL4';
let site = 'www.google.com';

exports.postData = (req, res, next) => {
    const url = req.body.url;
}
exports.getData = (req, res, next) => {
    getCred(global_email)
        .then(function(awsCredentials) {
            callAwis(awsCredentials, apiKey, site)
                .then((html) => {
                    //return JSON.stringify(html, null);
                    dataRet = JSON.stringify(html);
                    // console.log(dataRet);
                    // res.render('app/home', {
                    //     data: dataRet
                    // })
                })
        })
        .catch((e) => console.log(e))
}

const setUpQuery = () => {

}