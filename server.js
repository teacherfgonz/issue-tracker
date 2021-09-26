const express = require('express');
const config = require('./config');
const mongoose = require('mongoose');
const issue = require('./models/issue');
const {urlencoded} = require('body-parser');

const app = express();

app.set('view engine', 'ejs');

app.use(urlencoded({extended: true}))

app.get('/', async (req, res) => {
    await mongoose.connect(config.mongodb.uri);
    const issues = await issue.find({})
    res.render('issues.list.ejs', { issues })
})

app.get("/create", (req, res) => {
    res.render("issues.create.ejs")
})

app.post("/create", async (req, res) => {
    const {title, comment, status} = req.body
    await mongoose.connect(config.mongodb.uri);
    await issue.create({title, comment, status});
    res.redirect("/")
})

app.listen(config.port, () => {
    console.log(`listening on port ${config.port}`)
})

