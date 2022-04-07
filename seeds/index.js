const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
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
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground(
            {
                title: `${sample(descriptors)} ${sample(places)}`,
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                image: 'https://source.unsplash.com/collection/483251',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates eligendi tenetur ipsa quas earum ducimus suscipit architecto, aperiam sit a rerum? Excepturi vitae distinctio explicabo maiores, deserunt ratione aperiam. Distinctio.',
                price
            }
        );
        await camp.save();
    }
};

// seedDB()
//     .then(() => {
//         mongoose.connection.close();
//     });
