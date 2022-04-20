const mongoose = require('mongoose');
const { Schema } = mongoose;

const Review = require('./review');

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    // console.log(campground.reviews.length);
    // will check if the reviews array is empty
    if (doc) {
        const res = await Review.deleteMany({ _id: { $in: campground.reviews } });
        console.log(res);
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);