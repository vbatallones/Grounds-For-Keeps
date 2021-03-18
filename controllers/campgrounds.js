const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewFormCampground = async (req, res) => {
    res.render('campgrounds/new')
}

module.exports.creatingCampground = async (req, res, next) => {

    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(el => ({ url: el.path, fileName: el.filename }))
    campground.owner = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'owner'
        }
    }).populate('owner')
    if (!campgrounds) {
        req.flash('error', 'Campground missing!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campgrounds })
}

module.exports.renderEditFormCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Campground missing!');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    const imgs = req.files.map(el => ({ url: el.path, fileName: el.filename }))
    campgrounds.images.push(...imgs)
    await campgrounds.save()
    req.flash('success', 'Updated Campground');
    res.redirect(`/campgrounds/${campgrounds._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Deleted Campground');
    res.redirect('/campgrounds');
}