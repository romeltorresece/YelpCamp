const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const opts = (tags, attr) => ({
                    allowedTags: tags,
                    allowedAttributes: attr
                });
                const filtered = sanitizeHtml(value, opts(false, false)); // allow all tags and attributes
                const clean = sanitizeHtml(value, opts([], {})); // disallow all tags and attributes
                // comparing the filtered and clean values to allow other special characters
                // instead of just comparing clean value to original value, the special characters are escaped
                // and will always differ to original value thus throwing the error (e.g. & --> &amp;)
                if (clean !== filtered) return helpers.error('string.escapeHTML', { value });
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required().escapeHTML()
    }).required()
});