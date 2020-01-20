const { MongoClient } = require('mongodb');
const nanoid = require('nanoid');
const databaseUrl = process.env.DATABASE;
const dbName = 'shortener';
const collectionName = 'shortenedURLs';

let mongoClientObj = null;

class ShortenedURLModel {
    constructor() {}

    async createConnection() {
        const oThis = this;

        return MongoClient.connect(databaseUrl, { useNewUrlParser: true })
            .then(client => {
                mongoClientObj = client.db(dbName);
                console.log('Connection successfully established to the database.');
                return mongoClientObj;
            })
            .catch((err) => console.error('Failed to connect to the database.', err));
    }

    async checkIfShortIdExists(code) {
        const oThis = this;

        if(!mongoClientObj){
            await oThis.createConnection();
        }
        return mongoClientObj.collection('shortenedURLs').findOne({ short_id: code })
    };

    async fetchByUrl(url) {
        const oThis = this;

        if(!mongoClientObj){
            await oThis.createConnection();
        }

        const shortenedURLs = await mongoClientObj.collection(collectionName);

        return shortenedURLs.findOneAndUpdate({ original_url: url },
            {
                $setOnInsert: {
                    original_url: url,
                    short_id: nanoid(7),
                },
            },
            {
                returnOriginal: false,
                upsert: true,
            }
        );
    }

}

module.exports = ShortenedURLModel;
