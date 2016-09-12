const express = require('express');
const bodyParser = require('body-parser');

require('./models/user');
require('./models/project');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/url', (req, res) => {
  res.write('YAY');
});

const PORT = process.env.PORT || 3141;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
