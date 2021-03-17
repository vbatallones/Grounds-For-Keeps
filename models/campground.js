const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            fileName: String,
        }
    ],
    price: Number,
    description: String,
    location: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

CampgroundSchema.post('findOneAndDelete', async function (data) {
    if (data) {
        await Review.deleteMany({
            _id: {
                $in: data.reviews
            }
        })
    }

})

module.exports = mongoose.model('Campground', CampgroundSchema)