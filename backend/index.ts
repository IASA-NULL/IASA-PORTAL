import express from 'express'
import compression from 'compression'
import logger from 'morgan'
import path from 'path'
import cookieParser from 'cookie-parser'
import favicon from 'serve-favicon'
import vhost from 'vhost'
import cors from 'cors'

import apiRouter from './api/index'
import authRouter from './auth'
import accountRouter from './account'

import { getServerFlag } from './util/serverState'

import helmet from 'helmet'

declare const DEV_MODE: boolean

const app = express()

//app.use(helmet())
app.use(cookieParser())
app.use(cors())

app.use(compression())
app.use(logger('dev'))
app.use(favicon(path.join(__dirname, '..', '..', 'static', 'favicon.ico')))

app.use((req, res, next) => {
    if (
        req.headers['user-agent'].indexOf('MSIE') > -1 ||
        req.headers['user-agent'].indexOf('rv:') > -1
    )
        res.sendFile(path.join(__dirname, '..', '..', 'template', 'noIE.html'))
    else next()
})

app.use((req, res, next) => {
    if (getServerFlag('build')) {
        res.set('Cache-Control', 'no-store')
        res.sendFile(
            path.join(__dirname, '..', '..', 'template', 'building.html')
        )
    } else next()
})

app.use(authRouter)
app.use('/static', express.static(path.join(__dirname, '..', '..', 'static')))

if (DEV_MODE) {
    app.use('/api', apiRouter)
    app.use('/account', accountRouter)
} else {
    app.use(vhost('api', apiRouter))
    app.use(vhost('account', accountRouter))
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'template', 'main.html'))
})

app.listen(80, () => {
    console.log('Server is up on port 80.')
})

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err)
})
