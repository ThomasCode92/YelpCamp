const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
});

UserSchema.plugin(passportLocalMongoose); // add username & password field

module.exports = model('User', UserSchema);
