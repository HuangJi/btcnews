const btcnews = require('./btcnews');

// getPosts(source, callback), and source could use technews, bnext, btclub, 8btc
btcnews.getPosts('bitecoin', (err, body) => {
  if (err) {
    console.error(err);
  } else {
    console.log(body);
  }
});
// console.log(new Date('2016-05-03T13:32:11+00:00') / 1000)
// console.log(btcnews.sourceList);

// btcnews.getPosts('bnext', function(err, body) {
//     console.log(body);
// });
