const express = require('express');
const logger = require('morgan');
const request = require('request');
const cors = require('cors');

const PORT = process.env.PORT || 1984;
const CLIENT_ID = process.env.CLIENT_ID;
const API_URL = process.env.API_URL || 'https://api.soundcloud.com';
const WHITELIST = [
  'voronianski.com',
  'localhost',
  '127.0.0.1',
  '0.0.0.0'
];

const app = express();

app.use(logger('dev'));
app.use(cors(corsDelegate));
app.get('/resolve', handleResolve);
app.get('/stream/:trackId', handleStream);
app.use(handleMisc);

function corsDelegate (req, done) {
  const corsOptions = { origin: false };

  if (WHITELIST.includes(req.header('Origin')) !== -1) {
    corsOptions.origin = true;
  } else{
    corsOptions.origin = false;
  }

  done(null, corsOptions);
}

function handleResolve (req, res) {
  const resolver = `${API_URL}/resolve.json?url=${req.query.url}&client_id=${CLIENT_ID}`;

  return request(resolver).pipe(res);
}

function handleStream (req, res) {
  const stream = `${API_URL}/tracks/${req.params.trackId}/stream?client_id=${CLIENT_ID}`;

  return request(stream).pipe(res);
}

function handleMisc (req, res) {
  const giffy = 'https://media.giphy.com/media/rxZ4RFo1Vj9ao/giphy.gif';

  return request(giffy).pipe(res);
}

app.listen(PORT, () => {
  console.log('running on http://localhost:%s', PORT);
});
