/*
2021 SeoRii®. All right reserved.

app.ts
메인 애플리케이션!

TODO : Helmet 정책에 CSP 적용!
 */

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
import helmet from 'helmet'
import bodyParser from 'body-parser'
import morgan from 'morgan'
declare const DEV_MODE: boolean

export default function createApp(sid: string) {
    // sid 설정
    setServerState('sid', sid)

    const app = express()
    app.use(morgan('tiny'))

    // CORS 옵션 : iasa.kr 도메인에 대해 허용!
    const corsOptions = {
        credentials: true,
        origin: (origin: string, callback: any) => {
            console.log(origin)
            if (!origin || origin.includes('iasa.kr') || origin === 'null') {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
    }

    // CORS/Helmet 적용!(CSP 제외)
    if (!DEV_MODE) {
        app.use(cors(corsOptions))
        app.use(
            helmet({
                contentSecurityPolicy: false,
            })
        )
    }

    // 쿠키 Parsing!
    app.use(cookieParser())

    // HTTP 통신 압축!
    app.use(compression())

    // IE일 경우 요청 거부!
    app.use((req, res, next) => {
        try {
            if (
                req.headers['user-agent'].indexOf('MSIE') > -1 ||
                req.headers['user-agent'].indexOf('rv:') > -1
            ) {
                res.status(412)
                res.sendFile(
                    path.join(__dirname, '..', 'template', 'noIE.html')
                )
            } else next()
        } catch (e) {
            next()
        }
    })

    // static 파일 처리
    app.use('/static', express.static(path.join(__dirname, '..', 'static')))
    app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')))

    // 인증 처리(auth.ts)
    app.use(authRouter)

    // API 라우팅
    if (DEV_MODE) app.use('/api', apiRouter)
    else app.use(vhost('api.iasa.kr', apiRouter))

    // 서버 빌드 중 표시
    app.use((req, res, next) => {
        if (getServerFlag('build')) {
            res.status(503)
            res.set('Cache-Control', 'no-store')
            res.sendFile(
                path.join(__dirname, '..', 'template', 'building.html')
            )
        } else next()
    })

    // account/application 라우팅
    if (DEV_MODE) {
        app.use('/account', accountRouter)
        app.use('/application', applicationRouter)
    } else {
        app.use(vhost('account.iasa.kr', accountRouter))
        app.use(vhost('application.iasa.kr', applicationRouter))
    }

    app.post(
        '/finalize',
        bodyParser.urlencoded({ extended: false }),
        (req: any, res: any) => {
            res.send(`<html><body><script type="text/javascript">
            try {
                const next = '${req.body.next}'
                window.localStorage.tokenId = '${req.body.tokenId}'
                if (next) {
                    window.location.replace(atob(next))
                } else throw new Error()
            } catch (e) {
                window.location.replace('/')
            }
        </script></body></html>`)
        }
    )

    // 메인 템플릿 라우팅
    // TODO : ejs 라우팅 적용해서 최초 API 요청 없애기!
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'static', 'html', 'main.html'))
    })

    // 앱 시작시 로그
    app.listen(80, () => {
        console.log('Server is up on port 80.')
    })
}
