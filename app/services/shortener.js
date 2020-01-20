const dns = require('dns');
const nanoid = require('nanoid');
const ShortenedURLModel = require('../models/ShortenedURL');

class UrlShortener {
    constructor(originalUrl) {
        const oThis = this;

        oThis.originalUrl = originalUrl;
    }

    async perform() {
        const oThis = this;

        await dns.lookup(oThis.originalUrl.hostname, {}, (err, addresses) => {
            if (err) {
                return Promise.reject(err);
            } else {
                console.log('Resolved address ->', addresses);
                return addresses;
            }
        });

        return oThis.shortenURL(oThis.originalUrl.href);
    }

    async shortenURL(url) {
        const oThis = this;

        return new ShortenedURLModel().fetchByUrl(url);
    }
}

module.exports = UrlShortener;
