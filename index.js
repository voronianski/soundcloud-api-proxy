const cors = require('cors');
const logger = require('morgan');
const express = require('express');
const request = require('request');

const PORT = process.env.PORT || 1984;
const CLIENT_ID = process.env.CLIENT_ID;
const API_URL = process.env.API_URL || 'https://api.soundcloud.com';
const WHITELIST = (process.env.WHITELIST || '').split(',') || [
  'localhost',
  '127.0.0.1'
];

const app = express();

app.use(logger('dev'));
app.use(cors(corsDelegate));

// short variants
app.get('/resolve', handleResolve);
app.get('/stream/:trackId', handleStream);

// legacy soundcloud variants
app.get('/resolve.json', handleResolve);
app.get('/tracks/:trackId/stream', handleStream);

app.use(handleMisc);

function corsDelegate(req, done) {
  const corsOptions = { origin: false };

  if (WHITELIST.includes(req.header('Origin'))) {
    corsOptions.origin = true;
  }

  done(null, corsOptions);
}

function handleResolve(req, res) {
  const resolver = `${API_URL}/resolve.json?client_id=${CLIENT_ID}&url=${
    req.query.url
  }`;

  return request(resolver).pipe(res);
}

function handleStream(req, res) {
  const stream = `${API_URL}/tracks/${
    req.params.trackId
  }/stream?client_id=${CLIENT_ID}`;

  return request(stream).pipe(res);
}

function handleMisc(req, res) {
  const giffy = 'https://media.giphy.com/media/rxZ4RFo1Vj9ao/giphy.gif';

  return request(giffy).pipe(res);
}

app.listen(PORT, () => {
  console.log('running on http://localhost:%s', PORT);
});
