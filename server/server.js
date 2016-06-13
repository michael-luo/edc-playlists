import dotenv from 'dotenv';

// Load environment variables from .env file in devo
if (process.env.NODE_ENV !== 'production') {
  dotenv.load();
}

// Validate environment variables successfully loaded
const requiredVars = [
  'SPOTIFY_CLIENT_ID',
  'SPOTIFY_CLIENT_SECRET',
  'POPULATE_EVENTS',
];

for (const rv of requiredVars) {
  if (!process.env[rv]) {
    throw new Error(`${rv} not specified in the .env configuration file or as env variable`);
  }
}

import Express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import passport from 'passport';

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// Initialize the Express App
const app = new Express();

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// React And Redux Setup
import { configureStore } from '../shared/redux/store/configureStore';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';

// Import required modules
import routes from '../shared/routes';
import { fetchComponentData } from './util/fetchData';
import apiRoutes from './routes/api.routes';
import serverConfig from './config';
import logger from 'winston';
import expressLogger from 'express-winston';

// Connect to MongoDB
import connectToMongoDb from './connectToMongoDb';
const mongoose = connectToMongoDb(serverConfig.mongoURL);

// For session storage
import expressSession from 'express-session';
import connectMongo from 'connect-mongo';
const MongoStore = connectMongo(expressSession);

const secret = 'edm cat';

// Apply body Parser and server public assets and routes
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(cookieParser(secret));

// Use MongoDB for sessions
app.use(expressSession({
  secret,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14 * 24 * 60 * 60, // = 14 days. Default
    autoRemove: 'native', // Default
    touchAfter: 24 * 3600, // time period in seconds
  }),
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
}));

// Initilize passport with persistent login sessions
app.use(passport.initialize());
app.use(passport.session());
app.use(Express.static(path.resolve(__dirname, '../static')));

// Log requests
app.use(expressLogger.logger({
  transports: [
    new logger.transports.Console({
      json: true,
      colorize: true
    })
  ],
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
  colorStatus: true, // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

app.use('/api', apiRoutes(passport));

// Log errors
app.use(expressLogger.errorLogger({
  transports: [
    new logger.transports.Console({
      json: true,
      colorize: true
    })
  ]
}));


// Render Initial HTML
const renderFullPage = (html, initialState) => {
  const cssPath = process.env.NODE_ENV === 'production' ? '/css/app.min.css' : '/css/app.css';
  const head = Helmet.rewind();

  return `
    <!doctype html>
    <html>
      <head>
        ${head.base.toString()}
        ${head.title.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        ${head.script.toString()}

        <link rel="stylesheet" href=${cssPath} />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
        <link href='https://fonts.googleapis.com/css?family=Lato:400,300,700' rel='stylesheet' type='text/css'/>
        <link rel="shortcut icon" href="http://i.imgur.com/5hJBWeR.png" type="image/png" />
      </head>
      <body>
        <div id="root"><div>${html}</div></div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="/dist/bundle.js"></script>
        <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
      </body>
    </html>
  `;
};

const renderError = err => {
  const softTab = '&#32;&#32;&#32;&#32;';
  const errTrace = process.env.NODE_ENV !== 'production' ?
    `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>` : '';
  return renderFullPage(`Server Error${errTrace}`, {});
};

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
  match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
    if (err) {
      return res.status(500).end(renderError(err));
    }

    if (redirectLocation) {
      return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    }

    if (!renderProps) {
      return next();
    }

    const initialState = {
      data: {
        posts: [],
        post: {},
      },
      user: {},
      events: [],
      playlist: {},
    };

    const store = configureStore(initialState);

    return fetchComponentData(store, renderProps.components, renderProps.params)
      .then(() => {
        const initialView = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );
        const finalState = store.getState();

        res.status(200).end(renderFullPage(initialView, finalState));
      })
      .catch((err) => next(err));
  });
});

// Start app
app.listen(serverConfig.port, (error) => {
  if (!error) {
    console.log(`Discover EDM is running on port: ${serverConfig.port}`); // eslint-disable-line
  }
});

export default app;
