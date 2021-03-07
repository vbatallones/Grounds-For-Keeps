const express = require('express');
const router = express.Router();
const catchAsync = require('../error/catchAsync');
const ErrorHandling = require('../error/ErrorHandling');
const { campgroundSchema } = require('../schemaJoi.js');


// MODELS
const Campground = require('../models/campground');


const validateForm = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ErrorHandling(msg, 400)
    } else {
        next();
    }
}

// get all camp grounds
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))

// render the new campground form
router.get('/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new')
}))

// route to create a new campground
router.post('/', validateForm, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// show one camp ground by id
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id).populate('reviews')
    if (!campgrounds) {
        req.flash('error', 'Campground missing!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campgrounds })
}))


// render the edit form
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Campground missing!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

// update the campground
router.put('/:id', validateForm, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    req.flash('success', 'Updated Campground');
    res.redirect(`/campgrounds/${campgrounds._id}`);
}))

// delete the campground
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted Campground');
    res.redirect('/campgrounds');
}))

module.exports = router;