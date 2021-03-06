'use strict';

const cheerio = require('cheerio');
const request = require('request');
const stringjs = require('string');

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
    BNEXT_BITCOIN_TAG_URL: 'http://www.bnext.com.tw/search/tag/%E6%AF%94%E7%89%B9%E5%B9%A3',
    BABTC_BTICOIN_TAG_URL: 'http://www.8btc.com/bitcoin',
    BITECOIN_URL: 'http://www.bitecoin.com/',
    COINDESK_URL: 'http://www.coindesk.com/category/news/',
  };
  this.posts = [];
  this.sourceList = [
    {
      name: 'technews',
      source: 'TechNews 科技新報',
      imgUrl: 'http://www.gogobit.com/images/articleSources/technews.png',
    },
    {
      name: 'bnext',
      source: 'Bnext 數位時代',
      imgUrl: 'http://www.gogobit.com/images/articleSources/bnext.png',
    },
    {
      name: '8btc',
      source: '巴比特 - 比特幣中文社區',
      imgUrl: 'http://www.gogobit.com/images/articleSources/8btc.png',
    },
    {
      name: 'btclub',
      source: 'BT Club〉台灣比特幣俱樂部',
      imgUrl: 'http://www.gogobit.com/images/articleSources/btclub.png',
    },
    {
      name: 'bitecoin',
      source: '比特幣中文網',
      imgUrl: 'http://www.gogobit.com/images/articleSources/bitecoin.png',
    },
    {
      name: 'coindesk',
      source: 'Coindesk',
      imgUrl: 'http://www.gogobit.com/images/articleSources/coindesk.png',
    },
  ];
}

Btcnews.prototype.getPosts = function (source, callback) {
  var self = this;
  if (source === 'technews') {
    const techNewsObjectList = [];
    request(this.getOptions(this.uris.TECHNEWS_BITCOIN_TAG_URL), (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        const header = $('.entry-header');
        const content = $('.img').children();
        content.map(function (i, el) {
          techNewsObjectList.push(new Post($(this).attr('title'), $(this).attr('href'), 'TechNews 科技新報', $(this).children().attr('src'), null));
        });
        let j = 0;
        header.map(function (i, el) {
          const list = $(this).children().children().next().children().children().next().next().next().next()['0'].children;
          const timeString = list[0].data;
          techNewsObjectList[j].timestamp = self.getTimestamp('technews', timeString);
          j++;
        });
        callback(null, techNewsObjectList);
      } else {
        console.log(error);
        callback(error, null);
      }
    });
  } else if (source === 'bnext') {
    const bnextObjectList = [];
    request(this.getOptions(this.uris.BNEXT_BITCOIN_TAG_URL), (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        const target = $('.div_tab.item_box').children();
        target.map(function (i, el) {
          const imgUrl = stringjs($(this).children().children().attr('style')).between('url(\'', '\');').s;
          const title = stringjs($(this).children().next().children().children().first().text()).collapseWhitespace().s;
          const url = `http://www.bnext.com.tw${$(this).children().attr('href')}`;
          const timestamp = new Date($(this).children().next().children().next().children().children().first().text()).getTime() / 1000;
          bnextObjectList.push(new Post(title, url, 'Bnext 數位時代', imgUrl, timestamp));
        });
        callback(null, bnextObjectList);
      } else {
        console.log(error);
        callback(error, null);
      }
    });
  } else if (source === 'btclub') {
    request(this.getOptions(this.uris.BTCTW_TUMBLR_API), (error, response, body) => {
      if (error) {
        console.error(error);
        callback(error, null);
      } else {
        const postObjects = body.response.posts;
        for (let i = 0; i < postObjects.length; i++) {
          self.posts.push(new Post(postObjects[i].summary, postObjects[i].short_url, 'BT Club〉台灣比特幣俱樂部', stringjs(postObjects[i].body).between('<img src="', '" data-orig-height').s, postObjects[i].timestamp));
        }
        callback(null, self.posts);
      }
    });
  } else if (source === '8btc') {
    var self = this;
    const babtcObjectList = [];
    request(this.getOptions(this.uris.BABTC_BTICOIN_TAG_URL), (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        const list = $('#list').children();
        list.map(function (i, el) {
          const url = $(this).children().children().attr('href');
          let imgUrl = $(this).children().children().children().children().attr('src');
          const title = $(this).children().next().children().children().attr('title');
          const timeString = $(this).children().next().children().next().next().children('.visible-lg').text();
          imgUrl = encodeURI(imgUrl);
          babtcObjectList.push(new Post(title, url, '巴比特 - 比特幣中文社區', imgUrl, self.getTimestamp('8btc', timeString)));
        });
        callback(null, babtcObjectList);
      } else {
        console.log(error);
        callback(error, null);
      }
    });
  } else if (source === 'bitecoin') {
    var self = this;
    const bitecoinObjectList = [];
    request(this.getOptions(this.uris.BITECOIN_URL), (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        const list = $('#content').children();
        list.map(function (i, el) {
          const url = $(this).children().children().children().attr('href');
          const title = $(this).children().children('h1').text();
          let imgUrl = $(this).children().next().children().children().attr('src');
          const timeString = $(this).children().children('.entry-meta').children().next().children().attr('datetime');
          imgUrl = encodeURI(imgUrl);
          bitecoinObjectList.push(new Post(title, url, '比特幣中文網', imgUrl, self.getTimestamp('bitecoin', timeString)));
        });
        callback(null, bitecoinObjectList);
      } else {
        console.log(error);
        callback(error, null);
      }
    });
  } else if (source === 'coindesk') {
    var self = this;
    const coindeskObjectList = [];
    request(this.getOptions(this.uris.COINDESK_URL), (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        const list = $('#content').children();
        list.map(function (i, el) {
          const url = $(this).children().children().attr('href');
          const imgUrl = $(this).children().children().children().attr('src');
          const title = $(this).children().children().attr('title');
          const datetime = $(this).children().children().next().children().attr('datetime');
          const timestamp = new Date(datetime) / 1000;
          if (title) coindeskObjectList.push(new Post(title, url, 'Coindesk', imgUrl, timestamp));
        });
        callback(null, coindeskObjectList);
      } else {
        console.log(error);
        callback(error, null);
      }
    });
  } else {
        // TODO
    callback(null, null);
  }
};

Btcnews.prototype.getTimestamp = function (source, timeString) {
  if (source === 'technews') {
    const year = stringjs(timeString).between('', ' 年').s;
    const month = stringjs(timeString).between('年 ', ' 月').s;
    const date = stringjs(timeString).between('月 ', ' 日').s;
    const hour = stringjs(timeString).between('日 ', ':').s;
    const minute = stringjs(timeString).between(':', ' ').s;
    var dateString = `${year}/${month}/${date} ${hour}:${minute}:0`;
  } else if (source === '8btc') {
    var dateString = timeString;
  } else if (source === 'bitecoin') {
    var dateString = timeString;
  }
  return new Date(dateString) / 1000;
};

Btcnews.prototype.getOptions = function (url) {
  const options = {
    uri: url,
    headers: {
      'User-Agent': 'request',
    },
    json: true, // Automatically parses the JSON string in the response
  };
  return options;
};

module.exports = new Btcnews();
