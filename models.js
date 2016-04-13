var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    "twitterID": String,
    "token": String,
    "username": String,
    "displayName": String,
    "photo": String
});

var NewsFeedSchema = new mongoose.Schema({
	"user": String,
    "message": String,
    "posted": Date
})

exports.User = mongoose.model('message', UserSchema);
exports.NewsFeed = mongoose.model('news', NewsFeedSchema);