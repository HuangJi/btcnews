var btcnews = require('./btcnews');

// getPosts(source, callback), and source could use technews, bnext, btclub, 8btc
btcnews.getPosts('8btc', function(err, body) {
    console.log(body);
});

// btcnews.getPosts('bnext', function(err, body) {
//     console.log(body);
// });