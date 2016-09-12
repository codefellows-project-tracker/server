const express = require('express');
const bodyParser = require('body-parser');
const mers = require('mers');

require('./models/user');
require('./models/project');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', mers({ uri: 'mongodb://localhost/cpt' }).rest());

const PORT = process.env.PORT || 3141;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
