var btcnews = require('./btcnews');
var stringjs = require('string');

// btcnews.getPosts(null, function(err, body) {
// 	console.log(body);
// });

// btcnews.getPosts('btclub', function(err, body) {
// 	console.log(body);
// });

btcnews.getPosts('technews', function(err, body) {
	console.log(body);
});

// btcnews.getPosts('bnext', function(err, body) {
// 	console.log(body);
// });