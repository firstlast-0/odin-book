const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

async function loginCheck(req, res, next) {
    if (!req.user) {
        res.render("loginError");
    } else next();
}

exports.signup_post = [
    body('conpass', 'Passwords do not match').custom((value, { req }) => {
        return value === req.body.password;
    }),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const userExists = await User.findOne({ username: req.body.username }).exec();
        let user = new User({ username: req.body.username, password: req.body.password });

        if (userExists) {
            res.render('sign-up', { errors: [{ msg: 'Username already exists' }] });
        } else if (!errors.isEmpty()) {
            res.render('sign-up', { errors: errors.array() });
        } else {
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) next(err);

                user.password = hashedPassword;
                await user.save();
            });

            res.redirect('/login');
        }
    }),
];

exports.newpost_get = [ loginCheck,
    asyncHandler(async (req, res, next) => {
        res.render('new-post');
})];

exports.newpost_post = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user.id });
    let post = new Post({ text: req.body.text, by: user._id, time: new Date() });
    await post.save();
    res.redirect('/posts');
});

exports.posts_get = [ loginCheck,
    asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.user.id);
        const allPosts = await Post.find({}).populate("by").sort('-time');
        const allComments = await Comment.find({}).populate("on").populate("by");
        let relevantPosts = [];
        for (let post of allPosts) {
            if (user.following.includes(post.by.id) || user.id === post.by.id) {
                relevantPosts.push(post)
            }
        }

        if (relevantPosts.length === 0) {
            res.render("posts", { user, message: 'No posts to show' });
        } else {
            res.render("posts", { user, relevantPosts, allComments });
        }        
})];

exports.newcomment_get = [ loginCheck,
    asyncHandler(async (req, res, next) => {
        res.render('new-comment');   
})];

exports.newcomment_post = asyncHandler(async (req, res, next) => {
    let comment = new Comment({ text: req.body.text, by: req.user.id, on: req.params.postid });
    await comment.save();
    res.redirect('/posts');
});

exports.users_get = [ loginCheck,
    asyncHandler(async (req, res, next) => {
        const allUsers = await User.find({});
        res.render("users", { allUsers });
})];

exports.user_follow = [ loginCheck,
    asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.params.userid);
        user.follow_requests.push(req.user.id);
        await user.save();
        res.redirect('/users');
})];

exports.user_get = [ loginCheck,
    asyncHandler(async (req, res, next) => {
        const allUsers = await User.find({});
        const user = await User.findById(req.params.userid);
        const allPosts = await Post.find({}).populate("by").sort('-time');
        const allComments = await Comment.find({}).populate("on").populate("by");
        res.render("profile", { user, allUsers, allPosts, allComments });
})];

exports.user_accept = [ loginCheck,
    asyncHandler(async (req, res, next) => {
        const recipient = await User.findById(req.params.userid);
        const sender = await User.findById(req.body.id);
        sender.following.push(recipient.id);
        recipient.follow_requests.pull(sender.id);
        recipient.save();
        sender.save();
        res.redirect(`/users/${recipient.id}`);
})];

exports.like_post = [ loginCheck,
    asyncHandler(async (req, res, next) => {
        const post = await Post.findById(req.params.postid);
        post.likedBy.push(req.user.id);
        await post.save();
        res.redirect('/posts');
})];

exports.deletePost_get = [ loginCheck,
    asyncHandler(async (req, res, next) => {
        const user = await User.findById(req.user.id);
        const post = await Post.findById(req.params.postid);
        const allComments = await Comment.find({}).populate("on").populate("by");
        res.render("delete-post", { user, post, allComments });
})];

exports.deletePost_post = [ loginCheck, asyncHandler(async (req, res, next) => {
    await Comment.deleteMany({ on: req.body.postid });
    await Post.findByIdAndDelete(req.body.postid);
    res.redirect('/posts');
})];