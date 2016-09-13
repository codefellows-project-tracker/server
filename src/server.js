const express = require('express');
const bodyParser = require('body-parser');

const userRouter = require('./routes/user');
const projectRouter = require('./routes/project');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mount the api routes
const apiRouter = new express.Router();
apiRouter.use('/user', userRouter);
apiRouter.use('/project', projectRouter);

// Mount the API
app.use('/api', apiRouter);

module.exports = app;
