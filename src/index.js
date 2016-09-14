const mongoose = require('mongoose');

const app = require('./server');
const vantage = require('./vantage');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/cpt');

const PORT = process.env.PORT || 3141;
vantage.listen(app, PORT, function() {
  console.log('Vantage connected'); // eslint-disable-line no-console
});
console.log(`Server listening at http://localhost:${PORT}`); // eslint-disable-line no-console
