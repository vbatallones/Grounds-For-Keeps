const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../error/catchAsync');
const { reviewSchema } = require('../schemaJoi.js');
const Campground = require('../models/campground');
const Review = require('../models/review');

const ErrorHandling = require('../error/ErrorHandling');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ErrorHandling(msg, 400)
    } else {
        next();
    }
}


// create a review
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    campground.reviews.push(review)
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// delete review from the campground model using the $pull and delete review from the database
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Deleted review')
    res.redirect(`/campgrounds/${id}`)
}))


module.exports = router;