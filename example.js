var btcnews = require('./btcnews');

// getPosts(source, callback), and source could use technews, bnext, btclub.
btcnews.getPosts('technews', function(err, body) {
	console.log(body);
});