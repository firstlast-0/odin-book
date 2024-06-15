var express = require('express');
var router = express.Router();
const control = require('../controllers/control');

router.get('/', control.users_get);

router.post('/:userid/follow', control.user_follow);

router.get('/:userid', control.user_get);

router.post('/:userid/accept', control.user_accept);

module.exports = router;
