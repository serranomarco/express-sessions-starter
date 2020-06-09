
const express = require('express');
const session = require('express-session');
const store = require('connect-pg-simple');
const https = require('https');
const fs = require('fs')

const app = express();

app.set('view engine', 'pug');

app.use(session({
  name: 'Chocolate-Chip',
  store: new (store(session))(),
  secret: 'a5d63fc5-17a5-459c-b3ba-6d81792158fc',
  resave: true,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 86400000,
    path: '/',
    secure: true
  }
}));

app.use((req, res, next) => {
  let { history } = req.session
  console.log(req.session);
  if (!history) {
    history = [];
    req.session.history = [];
  }
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  // req.protocol +=/
  history.unshift(url);

  next();
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Home', history: req.session.history });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About', history: req.session.history });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact', history: req.session.history });
});

const port = 8080;

// app.listen(port, () => {
//   // console.log(address())
//   console.log(`Listening for connections on port ${port}...`)
// });
https.createServer({
  key: fs.readFileSync('../server.key'),
  cert: fs.readFileSync('../server.cert')
}, app)
  .listen(port, () => console.log(`Listening for connection on port ${port}`));
