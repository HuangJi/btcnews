var btcnews = require('./btcnews');
var stringjs = require('string');

btcnews.getPosts(null, function(err, body) {
	console.log(body);
});