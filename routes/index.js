var express = require('express');
var router = express.Router();
const control = require('../controllers/control');

router.get('/', function (req, res, next) {
    res.render('sign-up');
});

router.post('/', control.signup_post);

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/posts', control.posts_get);

router.get('/new-post', control.newpost_get);

router.post('/new-post', control.newpost_post);

router.get('/posts/:postid/comment', control.newcomment_get);

router.post('/posts/:postid/comment', control.newcomment_post);

router.post('/posts/:postid/like', control.like_post);

module.exports = router;
