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
import mailParse from './mailParse'

//import helmet from 'helmet'

declare const DEV_MODE: boolean

const app = express()

const corsOptions = {
    credentials: true,
    origin: (origin: string, callback: any) => {
        console.log(origin)
        if (!origin || origin.includes('iasa.kr')) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}

if (!DEV_MODE) app.use(cors(corsOptions))

//app.use(helmet())
app.use(cookieParser())

app.use(compression())
app.use(logger('dev'))
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')))

app.use((req, res, next) => {
    if (
        req.headers['user-agent'].indexOf('MSIE') > -1 ||
        req.headers['user-agent'].indexOf('rv:') > -1
    )
        res.sendFile(path.join(__dirname, '..', 'template', 'noIE.html'))
    else next()
})

app.use((req, res, next) => {
    if (getServerFlag('build')) {
        res.set('Cache-Control', 'no-store')
        res.sendFile(path.join(__dirname, '..', 'template', 'building.html'))
    } else next()
})

app.use('/static', express.static(path.join(__dirname, '..', 'static')))
app.use(authRouter)

if (DEV_MODE) {
    app.use('/api', apiRouter)
    app.use('/account', accountRouter)
} else {
    app.use(vhost('api.iasa.kr', apiRouter))
    app.use(vhost('account.iasa.kr', accountRouter))
    setInterval(mailParse, 5000)
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'template', 'main.html'))
})

app.listen(80, () => {
    console.log('Server is up on port 80.')
})

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err)
})
