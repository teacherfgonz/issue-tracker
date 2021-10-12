const mongoose = require("mongoose");
const config = require("./config");
const Issue = require("./models/issue");

module.exports = async function showCreateOrEditIssue(req, res) {
    let issue;
    if (req.params.id) {
        await mongoose.connect(config.mongodb.uri);
        issue = await Issue.findOne({_id: req.params.id})
    }

    const errors = JSON.parse(req.flash("errors")[0] || "{}");
    const form = JSON.parse(req.flash("form")[0] || "{}");
    const view = req.params.id ? "issues.edit.ejs" : "issues.create.ejs";
    res.render(view, {errors, form, issue});
}