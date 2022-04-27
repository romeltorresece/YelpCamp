const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.post('save', function(err, doc, next) {
    if (err.name === 'MongoServerError' && err.code === 11000 && err.keyValue.email) {
        next(new Error('Email already exists. Please provide a new email.'));
    } else {
        next();
    }
});

module.exports = mongoose.model('User', UserSchema);