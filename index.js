const express = require('express');
const logger = require('morgan');
const request = require('request');

const PORT = process.env.PORT || 1984;
const CLIENT_ID = process.env.CLIENT_ID;
const API_URL = process.env.API_URL || 'https://api.soundcloud.com';

const app = express();

app.use(logger('dev'));

app.get('/resolve', (req, res) => {
  const resolver = `${API_URL}/resolve.json?url=${req.query.url}&client_id=${CLIENT_ID}`;

  return request(resolver).pipe(res);
});

app.get('/stream/:trackId', (req, res) => {
  const stream = `${API_URL}/tracks/${req.params.trackId}/stream?client_id=${CLIENT_ID}`;

  return request(stream).pipe(res);
});

app.use((req, res) => {
  const giffy = 'https://media.giphy.com/media/rxZ4RFo1Vj9ao/giphy.gif';

  return request(giffy).pipe(res);
});

app.listen(PORT, () => {
  console.log('running on http://localhost:%s', PORT);
});
