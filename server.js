// Node.js Dependencies
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);


require("dotenv").load();
var mongoose = require('mongoose');
var models = require("./models");
var handlebars = require('express-handlebars');
var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;
var db = mongoose.connection;

var routes = { 
    index: require("./routes/index"),
    chat: require("./routes/chat")
};

var parser = {
    body: require("body-parser"),
    cookie: require("cookie-parser")
};

var strategy = { /* TODO */ };

// Database Connection
var db = require('./db');
// session middleware
var session_middleware = session({
    key: "session",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: db })
});

// Middleware
app.set("port", process.env.PORT || 3000);
app.engine('html', handlebars({ defaultLayout: 'layout', extname: '.html' }));
app.set("view engine", "html");
app.set("views", __dirname + "/views");
app.use(express.static(path.join(__dirname, "public")));
app.use(parser.cookie());
app.use(parser.body.urlencoded({ extended: true }));
app.use(parser.body.json());
app.use(require('method-override')());
app.use(session_middleware);
/* Passport Middleware Here*/
app.use(passport.initialize());
app.use(passport.session());

/* Use Twitter Strategy for Passport here */
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback"
}, function(token, token_secret, profile, done) {
    // What goes here? Refer to step 4.
    models.User.findOne({ "twitterID": profile.id }, function(err, user) {
    // (1) Check if there is an error. If so, return done(err);
    if(!user) {
        // (2) since the user is not found, create new user.
        // Refer to Assignment 0 to how create a new instance of a model
        var post = new models.User({
    		twitterID: profile.id
    	});

		post.save(function (res, err) {
			if (err) {
				return err;
			}
			else {
				console.log("Post saved");
				res.redirect('/');
			}
		});
        return done(null, profile);
    } else {
        // (3) since the user is found, update user’s information
        process.nextTick(function() {
            return done(null, profile);
        });
    }
  });
}));

/* Passport serialization here */
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Routes
/* Routes for OAuth using Passport */
app.get("/", routes.index.view);
// More routes here if needed
app.get("/auth/twitter", passport.authenticate('twitter'));
app.get("/auth/twitter/callback", 
	passport.authenticate('twitter', 
		{successRedirect: '/chat', failureRedirect: '/'}));
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get("/chat", routes.chat.view);

io.use(function(socket, next) {
    session_middleware(socket.request, {}, next);
});

/* TODO: Server-side Socket.io here */
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });

  socket.on("newsfeed", function(msg) {
    // your solution to fill in, see step 7 for details
    var date = new Date();
    var post = new models.NewsFeed({
    	twitterID: socket.request.session.passport.user,
    	message: msg,
    	posted: date
    });

    post.save(function (res, err) {
    	if (err) {
    		return err;
    	}
    	else {
    		console.log("Post saved");
    		res.redirect('/');
    	}
    });
    io.emit("newsfeed", msg);
});
});



// Start Server
http.listen(app.get("port"), function() {
    console.log("Express server listening on port " + app.get("port"));
});
