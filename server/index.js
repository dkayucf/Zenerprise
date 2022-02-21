/* eslint-disable import/first */
require('dotenv').config()
const os = require('os')
const cookieParser = require('cookie-parser')
import express from 'express'
import session from 'express-session'
import connectToDB from './database/db'
import morgan from 'morgan'
import compress from 'compression'
import methodOverride from 'method-override'
import cors from 'cors'
import httpStatus from 'http-status'
import expressWinston from 'express-winston'
import expressValidation from 'express-validation'
import helmet from 'helmet'
import winstonInstance from './config/winston'
import publicRoutes from './routes/public'
import privateRoutes from './routes/private/index'
import { isAuth, APIError } from './helpers'
const csrf = require('csurf')

require = require('esm')(module)

const app = express()
const apiPort = 5000
const environment = process.env.NODE_ENV
const sessionSecret = process.env.SESSION_SECRET

app.use(morgan('combined'))

if (environment === 'development') {
  app.use(
    morgan('dev', {
      skip(req, res) {
        return res.statusCode < 400
      }
    })
  )
}

app.use(express.json())
app.use(compress())
app.use(methodOverride())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

const store = connectToDB()

const debug = require('debug')('express-mongoose-es6-rest-api:index')

// enable detailed API logging in dev env
if (environment === 'development') {
  expressWinston.requestWhitelist.push('body')
  expressWinston.responseWhitelist.push('body')
  app.use(
    expressWinston.logger({
      winstonInstance,
      meta: true, // optional: log meta data about request (defaults to true)
      msg:
        'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    })
  )

  app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header(
      'Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE,UPDATE,OPTIONS'
    )
    res.header(
      'Access-Control-Allow-Headers',
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
    )
    next()
  })

  app.use('/apix/whoami', function(req, res) {
    res.status(200).send('<html>I am ' + os.hostname() + '</html>')
  })
}

const sess = {
  name: 'session',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    httpOnly: environment === 'production',
    secure: environment === 'production',
    expires: false,
    maxAge: 7200000
  },
  rolling: true
}

if (environment === 'production') {
  const expiryDate = new Date(Date.now() + 60 * 60 * 1000)
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.expires = expiryDate
  sess.cookie.path = '/apix/*'
  // sess.cookie.domain = 'zenerprise.com'
}

const csrfProtection = csrf({
  cookie: {
    key: 'token',
    sameSite: 'strict',
    secure: environment === 'production',
    httpOnly: environment === 'production',
    maxAge: 8000
  }
})

app.use(session(sess))
app.use(cookieParser())

app.get('/api/getCSRFToken', csrfProtection, (req, res) => {
  // console.log('CSRF TOKEN TEST---------------------->', req)
  res.json({ CSRFToken: req.csrfToken() })
})

app.use(function(err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  res.status(403)
  res.send('form tampered with')
})

// mount all routes on /api path
app.use('/api', csrfProtection, publicRoutes)

//mount all authenticated requests through apix endpoint with isAuth middleware check
app.use('/apix', csrfProtection, isAuth, privateRoutes)

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors
      .map(error => error.messages.join('. '))
      .join(' and ')
    const error = new APIError(unifiedErrorMessage, err.status, true)
    return next(error)
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic)
    return next(apiError)
  }
  return next(err)
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND)
  return next(err)
})

// error handler, send stacktrace only during development
app.use((
  err,
  req,
  res,
  next // eslint-disable-line no-unused-vars
) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: environment === 'development' ? err.stack : {}
  })
)

app.listen(apiPort, () => {
  console.log(`Server started on Port: ${apiPort} Environment: ${environment}`)
})

export default app
export { store }
