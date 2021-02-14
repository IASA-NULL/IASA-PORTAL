import express from 'express'
import jwt from 'jsonwebtoken'
import {token} from '../scheme/api/auth'
import getSecret from './util/secret'
import {getServerToken} from './util/serverState'
import {reSignTime, maxTime, leftTokenTime} from './util/tokenTime'
import createURL from '../scheme/url'

declare const DEV_MODE: boolean

declare global {
    namespace Express {
        interface Request {
            auth?: token
        }
    }
}

const router = express.Router()

router.use('*', (req, res, next) => {
    let sid = getServerToken()
    try {
        req.auth = jwt.verify(req.cookies.auth, getSecret('token')) as token
        if (req.auth.sid !== sid) {
            req.auth.expired = true
            if ((DEV_MODE && !req.originalUrl.includes('/api') && !req.originalUrl.includes('/account')) ||
                (!DEV_MODE && req.get('host') !== 'api.iasa.kr' && req.get('host') !== 'account.iasa.kr')) {
                res.redirect(
                    createURL('account', 'challenge') +
                    '?next=' +
                    Buffer.from(
                        req.protocol + '://' + req.get('host') + req.originalUrl
                    ).toString('base64')
                )
                return
            }
        } else if (req.auth.expire < Date.now()) {
            req.auth.expired = true
            if ((DEV_MODE && !req.originalUrl.includes('/api') && !req.originalUrl.includes('/account')) ||
                (!DEV_MODE && req.get('host') !== 'api.iasa.kr' && req.get('host') !== 'account.iasa.kr')) {
                res.redirect(
                    createURL('account', 'challenge') +
                    '?next=' +
                    Buffer.from(
                        req.protocol + '://' + req.get('host') + req.originalUrl
                    ).toString('base64')
                )
                return
            }
        } else if (req.auth.expire < Date.now() + reSignTime) {
            res.cookie(
                'auth',
                jwt.sign(
                    {
                        ...req.auth,
                        expire: Date.now() + maxTime,
                    },
                    getSecret('token')
                ),
                {maxAge: leftTokenTime, httpOnly: true, ...(!DEV_MODE && {domain: '.iasa.kr'})}
            )
        }
    } catch (e) {
        req.auth = undefined
        res.cookie('auth', '', {
            maxAge: -1,
            httpOnly: true,
            ...(!DEV_MODE && {domain: '.iasa.kr'}),
        })
    }
    try {
        const sudoToken = jwt.verify(
            req.cookies.sudo,
            getSecret('token')
        ) as token
        if (sudoToken.sid !== sid || sudoToken.expire < Date.now() || !req.auth)
            throw new Error()
        req.auth.sudo = true
    } catch (e) {
        res.cookie('sudo', '', {
            maxAge: -1,
            httpOnly: true,
            ...(!DEV_MODE && {domain: '.iasa.kr'}),
        })
    }
    next()
})

export default router
