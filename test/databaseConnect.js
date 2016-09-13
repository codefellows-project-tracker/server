const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/cptTest', (err) => {
  if (err) {
    throw err;
  }
});
