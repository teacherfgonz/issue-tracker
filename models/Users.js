const mongoose = require("mongoose");

module.exports = mongoose.model(
    "User",
    mongoose.Schema({
        name: String,
        email: {
            type: String,
            unique: true,
        },
        password: String,
    })
);