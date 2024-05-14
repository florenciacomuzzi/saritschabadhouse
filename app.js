const express = require("express")
const sassMiddleware = require('node-sass-middleware');
const path = require('path')
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const logger = require("./src/utils/logger");
const morganMiddleware = require("./src/middlewares/morgan.middleware");
// The morgan middleware does not need this. This is for a manual log.

const app = module.exports = express();

app.use(morganMiddleware);

const router = require('./src/router');
const { isTest, isProd, debugMode, isDebugMode } = require("./src/config/base");

// error handling middleware have an arity of 4
// instead of the typical (req, res, next),
// otherwise they behave exactly like regular
// middleware, you may have several of them,
// in different orders etc.
function error(err, req, res, next) {
  // log it
  if (!isTest()) logger.error(err.stack);
  res.status(500);
  res.send('Internal Server Error');
}

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.set('views', path.join(__dirname, 'src', 'pug'));
app.set('view engine', 'pug');

// our custom "verbose errors" setting
// which we can use in the templates
// via settings['verbose errors']
app.enable('verbose errors');

// disable them in production
// use $ NODE_ENV=production node examples/error-pages
if (isProd()) app.disable('verbose errors')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const dest = path.join(__dirname);
app.use(sassMiddleware({
  src: dest,
  dest: dest,
  log: function (severity, key, value) { logger.log(severity, `[sass] node-sass-middleware  ${key} : ${value}`); },
  // log: function (severity, key, val, text) {
  //   if (!isDebugMode() && severity === 'debug') { // skip debug when debug is off
  //     return;
  //   }
  //
  //   text = text || '';
  //
  //   if (severity === 'error') {
  //     logger.error('[sass]  \x1B[90m%s:\x1B[0m \x1B[36m%s %s\x1B[0m', key, val, text);
  //   } else {
  //     logger.log('info', '[sass]  \x1B[90m%s:\x1B[0m \x1B[36m%s %s\x1B[0m', key, val, text);
  //   }
  // },
  error: error,
  debug: isDebugMode(),
  outputStyle: 'compressed',
  // prefix:  '/prefix'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
// Note: you must place sass-middleware *before* `express.static` or else it will
// not work.
app.use('/css', express.static(dest));


app.use('/', router);

// the error handler is placed after routes
// if it were above it would not receive errors
// from app.get() etc
app.use(error);

const port = 5000;
app.listen(port, () => {
  console.log('Listening on port ' + port);
});

