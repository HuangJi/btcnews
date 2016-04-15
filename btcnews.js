var http = require('http');
var https = require('https');
var cheerio = require('cheerio');
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
		BTCTW_TUMBLR_API: 'https://api.tumblr.com/v2/blog/btctw.tumblr.com/posts/text?api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4&notes_info=true',
		TECHNEWS_BITCOIN_TAG_URL: 'http://technews.tw/tag/%E6%AF%94%E7%89%B9%E5%B9%A3/',
		BNEXT_BITCOIN_TAG_URL: 'http://www.bnext.com.tw/search/tag/%E6%AF%94%E7%89%B9%E5%B9%A3'
	};
	this.posts = [];
}

Btcnews.prototype.getPosts = function(source, callback) {
	var self = this;
	if (source == 'technews') {
		var techNewsObjectList = [];
		request(this.getOptions(this.uris.TECHNEWS_BITCOIN_TAG_URL), function (error, response, html) {
		    if (!error && response.statusCode == 200) {
		        var $ = cheerio.load(html);
		        header = $('.entry-header');
		        content = $('.img').children();
		        content.map(function(i, el) {
		          var object = {};

		          object.url = $(this).attr('href');
		          object.title = $(this).attr('title');
		          object.imgUrl = $(this).children().attr('src');
		          object.source = 'TechNews 科技新報';
		          techNewsObjectList.push(new Post($(this).attr('title'), $(this).attr('href'), 'TechNews 科技新報', $(this).children().attr('src'), null));
		        });

		        var j = 0;
		        header.map(function(i, el) {
		          var list = $(this).children().children().next().children().children().next().next().next().next()['0'].children;
		          var timeString = list[0].data;

		          techNewsObjectList[j].timestamp = self.getTimestamp(timeString);
		          j++;
		        });

		        callback(null, techNewsObjectList);
		    }
		    else {
		        console.log(error);
		        callback(error, null);
		    }
		});
	}
	else if (source == 'bnext') {
		var bnextObjectList = [];
		request(this.getOptions(this.uris.BNEXT_BITCOIN_TAG_URL), function (error, response, html) {
		    if (!error && response.statusCode == 200) {
				var $ = cheerio.load(html);
				target = $('.div_tab.item_box').children();
				target.map(function(i, el) {
					var imgUrl = stringjs($(this).children().children().attr('style')).between('url(\'', '\');').s;
					var title = stringjs($(this).children().next().children().children().first().text()).collapseWhitespace().s;
					var url = 'http://www.bnext.com.tw' + $(this).children().attr('href');
					var timestamp = new Date($(this).children().next().children().next().children().children().first().text()).getTime() / 1000;
					bnextObjectList.push(new Post(title, url, 'Bnext 數位時代', imgUrl, timestamp));
				});
				callback(null, bnextObjectList);
		    }
		    else {
		        console.log(error);
		        callback(error, null);
		    }
		});
	}
	else if (source == 'btclub'){
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
		});
	}
	else {
		// TODO
		callback(null, null);
	}
}

Btcnews.prototype.getTimestamp = function(timeString) {
	var year = stringjs(timeString).between('', ' 年').s;
	var month = stringjs(timeString).between('年 ', ' 月').s;
	var date = stringjs(timeString).between('月 ', ' 日').s;
	var hour = stringjs(timeString).between('日 ', ':').s;
	var minute = stringjs(timeString).between(':', ' ').s;
	var dateString = year + '/' + month + '/' + date + ' ' + hour + ':' + minute + ':0'; 
	return new Date(dateString) / 1000;
}

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