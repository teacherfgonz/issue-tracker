const Joi = require("joi");
const Join = require("joi");
const mongoose = require("mongoose");
const config = require("./config");
const flatJoi = require("./flatJoi");
const Issue = require("./models/issue");

module.exports = async function createOrUpdateIssue(req, res) {
    await mongoose.connect(config.mongodb.uri);

    const schema = Joi.object({
        title: Joi.string().required(),
        comment: Joi.string().max(200).required(),
        status: Joi.string().valid("Open", "Closed").required(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    const errors = flatJoi(error);

    if (Object.keys(errors).length > 0) {
        req.flash("errors", JSON.stringify(errors));
        req.flash("form", JSON.stringify(req.body));
        res.redirect(req.params.id ? `/edit/${req.params.id}` : "/create")
        return;
    }

    if (req.params.id) {
        await Issue.findOneAndUpdate({ _id: req.params.id }, req.body);
        req.flash("messages", "The issue was updated succesfully");
    } else {
        req.flash("messages", "An issue has been succesfully created");
        await Issue.create(req.body)
    }

    res.redirect("/");
};