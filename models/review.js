const mongoose = require('mongoose');
const { Schema } = mongoose;

const opts = { timestamps: true };

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts);

module.exports = mongoose.model('Review', reviewSchema);