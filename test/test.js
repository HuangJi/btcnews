/* global describe it:true */
/* eslint no-unused-expressions: ["off", { "allowShortCircuit": true }]*/
// const chai = require('chai');
const expect = require('chai').expect;
const btcnews = require('../btcnews');

describe('Basic crawling news test.', () => {
  it('technews', (done) => {
    btcnews.getPosts('technews', (err, body) => {
      expect(err).to.equal(null);
      expect(body.length).to.be.above(0);
      for (const post of body) {
        expect(post).to.have.property('title');
        expect(post).to.include.keys('url');
        expect(post).to.include.keys('source');
        expect(post).to.include.keys('imgUrl');
        expect(post).to.include.keys('timestamp');
        expect(post.title).to.be.ok;
        expect(post.url).to.be.ok;
        expect(post.source).to.be.ok;
        expect(post.imgUrl).to.be.ok;
        expect(post.timestamp).to.be.ok;
      }
      done();
    });
  });

  it('coindesk', (done) => {
    btcnews.getPosts('coindesk', (err, body) => {
      expect(err).to.equal(null);
      expect(body.length).to.be.above(0);
      for (const post of body) {
        expect(post).to.have.property('title');
        expect(post).to.include.keys('url');
        expect(post).to.include.keys('source');
        expect(post).to.include.keys('imgUrl');
        expect(post).to.include.keys('timestamp');
        expect(post.title).to.be.ok;
        expect(post.url).to.be.ok;
        expect(post.source).to.be.ok;
        expect(post.imgUrl).to.be.ok;
        expect(post.timestamp).to.be.ok;
      }
      done();
    });
  });

  it('8btc', (done) => {
    btcnews.getPosts('8btc', (err, body) => {
      expect(err).to.equal(null);
      expect(body.length).to.be.above(0);
      for (const post of body) {
        expect(post).to.have.property('title');
        expect(post).to.include.keys('url');
        expect(post).to.include.keys('source');
        expect(post).to.include.keys('imgUrl');
        expect(post).to.include.keys('timestamp');
        expect(post.title).to.be.ok;
        expect(post.url).to.be.ok;
        expect(post.source).to.be.ok;
        expect(post.imgUrl).to.be.ok;
        expect(post.timestamp).to.be.ok;
      }
      done();
    });
  });

  it('bitecoin', (done) => {
    btcnews.getPosts('bitecoin', (err, body) => {
      expect(err).to.equal(null);
      expect(body.length).to.be.above(0);
      for (const post of body) {
        expect(post).to.have.property('title');
        expect(post).to.include.keys('url');
        expect(post).to.include.keys('source');
        expect(post).to.include.keys('imgUrl');
        expect(post).to.include.keys('timestamp');
        expect(post.title).to.be.ok;
        expect(post.url).to.be.ok;
        expect(post.source).to.be.ok;
        expect(post.imgUrl).to.be.ok;
        expect(post.timestamp).to.be.ok;
      }
      done();
    });
  });

  it('btclub', (done) => {
    btcnews.getPosts('btclub', (err, body) => {
      expect(err).to.equal(null);
      expect(body.length).to.be.above(0);
      for (const post of body) {
        expect(post).to.have.property('title');
        expect(post).to.include.keys('url');
        expect(post).to.include.keys('source');
        expect(post).to.include.keys('imgUrl');
        expect(post).to.include.keys('timestamp');
        expect(post.title).to.be.ok;
        expect(post.url).to.be.ok;
        expect(post.source).to.be.ok;
        expect(post.imgUrl).to.be.ok;
        expect(post.timestamp).to.be.ok;
      }
      done();
    });
  });
});
