const bcrypt = require("bcrypt");
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport')
const flash = require('connect-flash');
const session = require('express-session');
const {urlencoded} = require('body-parser');
const LocalStrategy = require("passport-local").Strategy;
const config = require('./config'); 
const Issue = require('./models/issue');
const User = require('./models/Users')
const createOrUpdateIssue = require("./createOrUpdateIssue");
const showCreateOrEditIssue = require("./showCreateOrEditIssue");
const Joi = require("joi");
const flatJoi = require("./flatJoi");

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
app.use(express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(
        { usernameField: "email"},
        async (email, password, done) => {
            try {
                await mongoose.connect(config.mongodb.uri);
                const user = await User.findOne({email})

                if (!user || !bcrypt.compareSync(password, user.password)) {
                    return done(null, false, { message: "Incorrect Credentials"})
                }

                return done(null, user); // successful login
            } catch(err) {
                done(err);
            }
        }
    )
)

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    await mongoose.connect(config.mongodb.uri);
    const user = await user.findOne({_id: id});
    done(null, user);
})

app.get("/login", (req, res) => {
    res.render("login.ejs", { error: req.flash("error") });
});
app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    })
);

app.get("/register", (req, res) => {
    const errors = JSON.parse(req.flash("errors")[0] || "{}");
    const form = JSON.parse(req.flash("form")[0] || "{}");
    res.render("register.ejs", {errors, form})
});

app.post("/register", async (req, res) => {
    
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}),
        password: Joi.string(),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    const errors = flatJoi(error);

    console.log(errors)

    if (Object.keys(errors).length > 0) {
        req.flash("errors", JSON.stringify(errors));
        req.flash("form", JSON.stringify(req.body));
        res.redirect("/register")
        return;
    }

    await mongoose.connect(config.mongodb.uri);
    const { name, email, password } = req.body;
    await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
    });
    res.redirect("/login");
})

app.use((req, res) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
});

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

app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/")
});

app.listen(config.port, () => {
    console.log(`listening on port ${config.port}`)
})

