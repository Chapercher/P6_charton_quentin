const mongoose = require('mongoose');
const mongooseErrors = require('mongoose-errors');
const uniqueValidator = require('mongoose-unique-validator');
const {model} = require('mongoose');

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseErrors);
module.exports = mongoose.model('User', userSchema);// module = variable & exports = object : tout ce qui est affecté à module.exports sera exporter en tant que module
