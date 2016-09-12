const express = require('express');
const bodyParser = require('body-parser');
const mers = require('mers');

require('./models/user');
require('./models/project');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/cpt';
app.use('/api', mers({ uri: MONGODB_URI }).rest());

const PORT = process.env.PORT || 3141;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
