const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/cozy', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log("Database connected")
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]
const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20 + 10)
        const camp = new Campground({
            owner: "60486d0ffe69fe5f39bfabce",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore illo veniam explicabo eaque ex dolores nobis eligendi, doloremque mollitia quidem fugit, incidunt nemo, minus deserunt obcaecati repudiandae nulla debitis ab.",
            price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})