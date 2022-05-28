const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res)=> {
    const { slug } = req.params;
    const campground = await Campground.findOne({ slug });
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully posted a review!');
    res.redirect(`/campgrounds/${campground.slug}`);
};

module.exports.deleteReview = async (req, res) => {
    const { slug, reviewId } = req.params;
    const campground = await Campground.findOneAndUpdate({ slug }, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/campgrounds/${campground.slug}`);
};