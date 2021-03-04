const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')

// Error handling
const catchAsync = require('./error/catchAsync')
const ErrorHandling = require('./error/ErrorHandling');

const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/ground-for-keeps', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log("Database connected")
})

app.engine('ejs', ejsMate)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

// get all camp grounds
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))

// render the new campground form
app.get('/campgrounds/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new')
}))

// route to create a new campground
app.post('/campgrounds', catchAsync(async (req, res, next) => {
    if (!req.body.campground) throw new ErrorHandling('Invalid Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

// show one camp ground by id
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)
    res.render('campgrounds/show', { campgrounds })
}))


// render the edit form
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}))

// update the campground
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    res.redirect(`/campgrounds/${campgrounds._id}`)
}))

// delete the campground
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.all('*', (req, res, next) => {
    next(new ErrorHandling('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('errorPage', { err });
})

app.listen(3000, () => {
    console.log('Listening to port 3000')
})