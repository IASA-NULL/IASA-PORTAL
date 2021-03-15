import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import favicon from 'serve-favicon'
import path from 'path'
import { getServerFlag, setServerState } from './util/serverState'
import authRouter from './auth'
import apiRouter from './api'
import accountRouter from './account'
import applicationRouter from './application'
import vhost from 'vhost'
import mailParse from './mailParse'
import helmet from 'helmet'
declare const DEV_MODE: boolean

export default function createApp(sid: string) {
    setServerState('sid', sid)

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

    if (!DEV_MODE) {
        app.use(cors(corsOptions))
        app.use(
            helmet({
                contentSecurityPolicy: false,
            })
        )
    }

    app.use(cookieParser())

    app.use(compression())

    app.use((req, res, next) => {
        if (
            req.headers['user-agent'].indexOf('MSIE') > -1 ||
            req.headers['user-agent'].indexOf('rv:') > -1
        ) {
            res.status(412)
            res.sendFile(path.join(__dirname, '..', 'template', 'noIE.html'))
        } else next()
    })

    app.use('/static', express.static(path.join(__dirname, '..', 'static')))
    app.use(authRouter)

    if (DEV_MODE) app.use('/api', apiRouter)
    else app.use(vhost('api.iasa.kr', apiRouter))

    app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')))

    app.use((req, res, next) => {
        if (getServerFlag('build')) {
            res.status(503)
            res.set('Cache-Control', 'no-store')
            res.sendFile(
                path.join(__dirname, '..', 'template', 'building.html')
            )
        } else next()
    })

    if (DEV_MODE) {
        app.use('/account', accountRouter)
        app.use('/application', applicationRouter)
    } else {
        app.use(vhost('account.iasa.kr', accountRouter))
        app.use(vhost('application.iasa.kr', applicationRouter))
        setInterval(mailParse, 5000)
    }

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'template', 'main.html'))
    })

    app.listen(80, () => {
        console.log('Server is up on port 80.')
    })
}
