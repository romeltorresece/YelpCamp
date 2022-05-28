if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl)
    .then(() => {
        console.log('MONGO CONNECTION OPEN!');
    })
    .catch(err => {
        console.log('CONNECTION ERROR!');
        console.log(err);
    });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground(
            {
                author: '62661398f5f441d8b3a9a6fa',
                title: `${sample(descriptors)} ${sample(places)}`,
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates eligendi tenetur ipsa quas earum ducimus suscipit architecto, aperiam sit a rerum? Excepturi vitae distinctio explicabo maiores, deserunt ratione aperiam. Distinctio.',
                price,
                geometry: { 
                    type: 'Point', 
                    coordinates: [ 
                        cities[random1000].longitude, 
                        cities[random1000].latitude 
                    ] 
                },
                images: [
                    {
                      url: 'https://res.cloudinary.com/dbhv1lwyz/image/upload/v1651984641/YelpCamp/wiy0s0yweyoqnzcveziu.jpg',
                      filename: 'YelpCamp/wiy0s0yweyoqnzcveziu'
                    },
                    {
                      url: 'https://res.cloudinary.com/dbhv1lwyz/image/upload/v1651984647/YelpCamp/y24cymrtbk83cnar1way.jpg',
                      filename: 'YelpCamp/y24cymrtbk83cnar1way'
                    }
                  ]
            }
        );
        await camp.save();
    }
};

seedDB()
    .then(() => {
        mongoose.connection.close();
    });
