var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose =require("passport-local-mongoose"),
	User = require("./model/user");

mongoose.connect("mongodb+srv://cubeboardtech:Bsam191004@cluster0.v6b6a.mongodb.net/netflix");

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")
({
	secret: "abc",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function (req, res) {
	res.render("home");
});


app.get("/profile", isLoggedIn, function (req, res) {
	res.render("profile",{fname:req.user.firstname,lname:req.user.lastname,email:req.user.username});
});


app.get("/register", function (req, res) {
	res.render("register");
});


app.post("/register", function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var firstname=req.body.firstname;
	var lastname= req.body.lastname;
	User.register(new User({
		username: username,
		firstname:firstname,
		lastname:lastname
	 }),
			password, function (err, user) {
		if (err) {
			console.log(err);
			return res.render("register");
		}

		passport.authenticate("local")
		(
			req, res, function () {
			res.render("login");
		});
	});
});

//Showing login form
app.get("/login", function (req, res) {
	res.render("login");
});

//Handling user login
app.post("/login", passport.authenticate("local", {
	successRedirect: "/profile",
	failureRedirect: "/login"
}), function (req, res) {
});

//Handling user logout
app.get("/logout", function(req, res, next) {
    req.logout(function(err) {
      if (err) {
        return next(err);
      }

      res.render("/");
    });
  });

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) 
	return next();
	res.redirect("/login");
}

var port =  8000;
app.listen(port, function () {
	console.log("Server Has Started!");
});
