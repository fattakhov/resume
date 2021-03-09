'use strict';

const express = require('express');
const path = require('path');
const app = express();

app.use('/static', express.static(__dirname + '/static'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.get('/resume.pdf', (req, res) => {
  res.sendFile(path.join(__dirname + '/static/resume.pdf'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
