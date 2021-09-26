const mongoose = require('mongoose');
module.exports = mongoose.model(
    'Issue',
    mongoose.Schema({
        title: String,
        comment: String,
        status: String,
    })
)