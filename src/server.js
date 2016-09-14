const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const PassportLocal = require('passport-local');
const jwt = require('jsonwebtoken');
const debug = require('debug')('cpt:server');
const cors = require('cors');

const config = require('./config');
const userRouter = require('./routes/user');
const projectRouter = require('./routes/project');
const User = require('./models/user');

const app = express();

passport.use(new PassportLocal({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        debug(`User with email "${user.email}" does not exist`);
        return done(null, false, { message: 'Email or password incorrect' });
      }

      return user.comparePassword(password);
    })
    .then((user) => {
      // Successful login
      done(null, user);
    })
    .catch((err) => {
      // Password incorrect
      debug('Password is incorrect', err);
      done(null, false, { message: 'Email or password incorrect' });
    });
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Mount the api routes
const apiRouter = new express.Router();
apiRouter.use('/user', userRouter);
apiRouter.use('/project', projectRouter);

// Handle auth
apiRouter.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: 'Username or password is incorrect' });

    const token = jwt.sign({ email: user.email }, config.SECRET);
    return res.status(200).json({ token });
  })(req, res, next);
});

// Mount the API
app.use('/api', apiRouter);

module.exports = app;
