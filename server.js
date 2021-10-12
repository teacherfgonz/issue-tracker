const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const {urlencoded} = require('body-parser');
const config = require('./config'); 
const Issue = require('./models/issue');
const createOrUpdateIssue = require("./createOrUpdateIssue");
const showCreateOrEditIssue = require("./showCreateOrEditIssue");

const app = express();

app.set('view engine', 'ejs');

app.use(urlencoded({extended: true}));

app.use(
    session({
        name: config.session.cookieName,
        secret: config.session.secret,
        resave: true,
        saveUninitialized: true
    })
);

app.use(flash());

app.get('/', async (req, res) => {
    await mongoose.connect(config.mongodb.uri);
    const issues = await Issue.find({})
    const messages = req.flash("messages")
    res.render('issues.list.ejs', { issues, messages })
});

app.get("/create", showCreateOrEditIssue);
app.post("/create", createOrUpdateIssue);
app.get("/edit/:id", showCreateOrEditIssue);
app.post("edit/:id", createOrUpdateIssue);
app.post("/delete/:id", async (req, res) => {
    await mongoose.connect(config.mongodb.uri);
    await Issue.deleteOne({_id: req.params.id });
    req.flash("messages", "The issue was deleted succesfully")
    res.redirect("/")
})

app.listen(config.port, () => {
    console.log(`listening on port ${config.port}`)
})

