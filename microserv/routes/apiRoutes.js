const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const apiController = require('../controllers/apiController');
const apiAuth = require('../middleware/api-auth')

// router.post('/app', [
//         body('url')
//         .isURL()
//         .withMessage('Please Enter a valid Url')
//     ],
//     testController.postData
// );
router.put('/configure', apiController.configure);
router.get('/urls', apiController.getUrls);
router.post('/login', apiController.postLogin);
router.get('/urls/:url', apiAuth, apiController.getUrl);
router.put('/urls', apiAuth, [
        body('url')
        .isURL()
    ],
    apiController.postData
);
router.delete('/urls/:url', apiAuth, apiController.deleteUrl);

module.exports = router;