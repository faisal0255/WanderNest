const { string, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    email: {
        type: string,
        required: true
    }
});

User.plugin(passportLocalMongoose); //it automatically generate username or password with using hashing and salting

module.exports = mongoose.model("User", userSchema);