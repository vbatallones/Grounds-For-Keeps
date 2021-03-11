const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../error/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next();
            req.flash('success', 'Welcome to CozY');
            res.redirect('/campgrounds')
        });

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectToUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectToUrl)
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "Logged out")
    res.redirect('/campgrounds')
})

module.exports = router