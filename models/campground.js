const mongoose = require('mongoose');
const { Schema } = mongoose;
const { cloudinary } = require('../cloudinary');
const mongoosePaginate = require('mongoose-paginate-v2');

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

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
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
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
        <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <p>${this.description.substring(0, 20)}...</p>`;
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

CampgroundSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Campground', CampgroundSchema);