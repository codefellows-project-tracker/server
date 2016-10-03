//hmmm, the naming of this and the server file seem a little confusing
//also your package.json is pointing to a file that doesn't exist for the "main" file
//it should probably point to what you have listed as the server.js file
const mongoose = require('mongoose');

const app = require('./server');
const vantage = require('./vantage');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/cpt');

const PORT = process.env.PORT || 3141;
vantage.listen(app, PORT, () => {
  console.log('Vantage connected'); // eslint-disable-line no-console
});
console.log(`Server listening at http://localhost:${PORT}`); // eslint-disable-line no-console
