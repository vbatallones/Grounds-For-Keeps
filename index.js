const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')

const mongoose = require('mongoose');
const Campground = require('./models/campground')

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
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
})

// render the new campground form
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// route to create a new campground
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

// show one camp ground by id
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)
    res.render('campgrounds/show', { campgrounds })
})


// render the edit form
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
})

// update the campground
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    res.redirect(`/campgrounds/${campgrounds._id}`)
})

// delete the campground
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.use((err, req, res, next) => {
    const {status = 500, message = "Something went wrong"} = err;
    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log('Listening to port 3000')
})