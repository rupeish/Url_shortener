// Load env variables.
require('dotenv').config();
const URL = require('url').URL;

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ShortenedURLModel = require('./app/models/ShortenedURL');
const ShortenerKlass = require('./app/services/shortener');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// GET home page
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(htmlPath);
});

// POST shorten URL
app.post('/shorten', (req, res) => {
  let originalUrl;
  //console.log(req.body.url);
  try {
  	//console.log("=======2",req.body.url);
    originalUrl = new URL(req.body.url);
    console.log("=======3",originalUrl);
  } catch (err) {
    return res.status(400).send({error: 'invalid URL'});
  }
  
  new ShortenerKlass(originalUrl).perform()
      .then(function (result) {
          console.log('\nresult =>', result);
          const doc = result.value;
          res.json({
              original_url: doc.original_url,
              short_id: doc.short_id,
          });
        })
        .catch(function (err) {
            console.log('error =>', err);
            res.status(404).send({error: 'Address not found', err});
        });

});

// GET short id for url from DB
app.get('/:short_id', (req, res) => {
  const shortId = req.params.short_id;

  new ShortenedURLModel().checkIfShortIdExists(shortId)
      .then(doc => {
          if (doc === null) return res.send('Error: unable to find a link at that URL');
          res.redirect(doc.original_url)
      })
      .catch(console.error);

});

app.set('port', process.env.PORT || 4100);
const server = app.listen(app.get('port'), () => {
  console.log(`Server running → PORT ${server.address().port}`);
});
