const express = require('express');
const bodyParser = require('body-parser');
const mers = require('mers');

require('./models/user');
require('./models/project');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', mers({ uri: 'mongodb://localhost/cpt' }).rest());

app.listen(3141, () => {
  console.log('Server listening at http://localhost:3141');
});
