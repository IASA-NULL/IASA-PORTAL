import express from 'express'
import jwt from 'jsonwebtoken'
import { changePasswordToken, token } from '../scheme/api/auth'
import getSecret from './util/secret'
import path from 'path'
import { getServerToken } from './util/serverState'
import createResponse from './createResponse'
import { TOKEN_EXPIRE_ERROR } from '../string/error'

const maxTime = 1000 * 60 * 60 * 24 * 7
const reSignTime = 1000 * 60 * 60 * 24 * 3
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
            req.auth = undefined
            res.cookie('auth', '', {
                maxAge: -1,
                httpOnly: true,
                ...(!DEV_MODE && { domain: '.iasa.kr' }),
            })
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
                { maxAge: maxTime, httpOnly: true, domain: '.iasa.kr' }
            )
        } else if (req.auth.expire < Date.now()) {
            req.auth = undefined
            res.cookie('auth', '', {
                maxAge: -1,
                httpOnly: true,
                ...(!DEV_MODE && { domain: '.iasa.kr' }),
            })
        }
    } catch (e) {
        req.auth = undefined
        res.cookie('auth', '', {
            maxAge: -1,
            httpOnly: true,
            ...(!DEV_MODE && { domain: '.iasa.kr' }),
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
            ...(!DEV_MODE && { domain: '.iasa.kr' }),
        })
    }
    next()
})

export default router
