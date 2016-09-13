const mongoose = require('mongoose');

const app = require('./server');

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/cpt');

const PORT = process.env.PORT || 3141;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`); // eslint-disable-line no-console
});
