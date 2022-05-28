const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async (req, res) => {
    const { page = 1 } = req.query;
        const campgrounds = await Campground.paginate({}, {
            page,
            limit: 20,
        });
        // const { docs, ...data } = campgrounds;
        // console.log(data);
        if (!campgrounds.docs.length || isNaN(page) || page < 1) {
            throw new ExpressError('Page Not Found', 404);
        }
        if (req.get('Accept') === 'application/json') {
            res.status(200).json(campgrounds);
        } else {
            res.render('campgrounds/index', { campgrounds });
        }
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user._id;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await campground.save();
    req.flash('success', 'Successfully created a new Campground!');
    res.redirect(`/campgrounds/${campground.slug}`);
};

module.exports.showCampground = async (req, res) => {
    const { slug } = req.params;
    const campground = await Campground.findOne({ slug }).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Campground Not Found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const { slug } = req.params;
    const campground = await Campground.findOne({ slug });
    if (!campground) {
        req.flash('error', 'Campground Not Found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { slug } = req.params;
    const { title, location, description, price } = req.body.campground;
    const campground = await Campground.findOne({ slug });
    // from req.body.campground
    campground.title = title;
    campground.location = location;
    campground.description = description;
    campground.price = price;
    // check if location has been modified
    if (campground.isModified('location')) {
        // console.log('location is modified', campground.isModified('location'));
        const geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send();
        campground.geometry = geoData.body.features[0].geometry;
    }
    
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);

    await campground.save();

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground.slug}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { slug } = req.params;
    await Campground.findOneAndDelete({ slug });
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
};