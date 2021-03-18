const User = require('../models/user');
const passport = require('passport');

module.exports.renderRegisterFormUser = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res, next) => {
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
}

module.exports.renderLoginFormUser = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = async (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectToUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectToUrl)
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', "Logged out")
    res.redirect('/campgrounds')
}