const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateCampground = (req, res, next) => { 
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(' ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = catchAsync(async (req, res, next) => {
    const { slug } = req.params;
    const campground = await Campground.findOne({ slug });
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${campground.slug}`);
    }
    next();
});

module.exports.isReviewAuthor = catchAsync(async (req, res, next) => {
    const { slug, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${slug}`);
    }
    next();
});

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(' ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};