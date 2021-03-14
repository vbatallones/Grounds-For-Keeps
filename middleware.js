const ErrorHandling = require('./error/ErrorHandling');
const { campgroundSchema, reviewSchema } = require('./schemaJoi.js');
const Campground = require('./models/campground');
const Review = require('./models/review')



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateForm = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ErrorHandling(msg, 400)
    } else {
        next();
    }
}

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    if (!campgrounds.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    } else {
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ErrorHandling(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewOwner = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.owner.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    } else {
        next();
    }
}