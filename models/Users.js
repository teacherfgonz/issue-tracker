const mongoose = require("mongoose");

module.exports = mongoose.model(
    "User",
    mongoose.Schema({
        email: {
            type: String,
            unique: true,
        },
        password: String,
    })
);