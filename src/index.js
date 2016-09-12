const app = require('./server');

const PORT = process.env.PORT || 3141;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
