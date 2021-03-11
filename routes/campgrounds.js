const express = require('express');
const router = express.Router();
const catchAsync = require('../error/catchAsync');
const ErrorHandling = require('../error/ErrorHandling');
const { campgroundSchema } = require('../schemaJoi.js');
const { isLoggedIn, isOwner, validateForm } = require('../middleware')


// MODELS
const Campground = require('../models/campground');


// get all camp grounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))

// render the new campground form
router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    res.render('campgrounds/new')
}))

// route to create a new campground
router.post('/', isLoggedIn, validateForm, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.owner = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// show one camp ground by id
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id).populate('reviews').populate('owner')
    if (!campgrounds) {
        req.flash('error', 'Campground missing!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campgrounds })
}))


// render the edit form
router.get('/:id/edit', isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Campground missing!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

// update the campground
router.put('/:id', isLoggedIn, isOwner, validateForm, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    req.flash('success', 'Updated Campground');
    res.redirect(`/campgrounds/${campgrounds._id}`);
}))

// delete the campground
router.delete('/:id', isLoggedIn, isOwner, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted Campground');
    res.redirect('/campgrounds');
}))


module.exports = router;