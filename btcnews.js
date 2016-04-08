var http = require('http');
var https = require('https');
var request = require('request');
var stringjs = require('string');

function Post(title, url, source, imgUrl, timestamp) {
	this.title = title;
	this.url = url;
	this.source = source;
	this.imgUrl = imgUrl;
	this.timestamp = timestamp;
}

function Btcnews() {
	this.date = null;
	this.uris = {
		BTCTW_TUMBLR_API : 'https://api.tumblr.com/v2/blog/btctw.tumblr.com/posts/text?api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4&notes_info=true'
	};
	this.posts = [];
}

Btcnews.prototype.getPosts = function(source, callback) {
	var self = this;
	request(this.getOptions(this.uris.BTCTW_TUMBLR_API), function(error, response, body) {
		if (error) {
			console.error(error);
			callback(error, null);
		}
		else {
			var postObjects = body.response.posts;
			for (var i = 0; i < postObjects.length; i++) {
				self.posts.push(new Post(postObjects[i].summary, 
										postObjects[i].short_url, 
										'BT Club〉台灣比特幣俱樂部', 
										stringjs(postObjects[i].body).between('<img src="', '" data-orig-height').s,
										postObjects[i].timestamp));
			}
			callback(null, self.posts);
		}
	}
);}

Btcnews.prototype.getOptions = function(url) {
	var options = {
	    uri:url,
	    headers: {
	        'User-Agent': 'request'
	    },
	    json:true // Automatically parses the JSON string in the response 
	};
	return options;
}

module.exports = new Btcnews();