const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/user');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mount the api routes
const apiRouter = new express.Router();
apiRouter.use('/user', userRouter);

// Mount the API
app.use('/api', apiRouter);

const PORT = process.env.PORT || 3141;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
