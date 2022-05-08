const mongoose = require('mongoose');
const { Schema } = mongoose;
const { cloudinary } = require('../cloudinary');

const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

// thumbnail transformation url in cloudinary, modified the width of the original image with w_200
// https://res.cloudinary.com/dbhv1lwyz/image/upload/w_200/v1651800152/YelpCamp/rjmw98khcahbdz1g1kpd.jpg
ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc && doc.reviews.length) {
        await Review.deleteMany({ _id: { $in: doc.reviews } });
    }
    if (doc && doc.images.length) {
        for (let img of doc.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);