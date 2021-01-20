import express from 'express'
import jwt from 'jsonwebtoken'
import { token } from '../scheme/api/auth'
import getSecret from './util/secret'
import path from 'path'
import { getServerToken } from './util/serverState'

const maxTime = 1000 * 60 * 60 * 24 * 7
const reSignTime = 1000 * 60 * 60 * 24 * 3

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
            res.cookie('auth', '', { maxAge: -1, httpOnly: true })
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
                { maxAge: maxTime, httpOnly: true }
            )
        } else if (req.auth.expire < Date.now()) {
            req.auth = undefined
            res.cookie('auth', '', { maxAge: -1, httpOnly: true })
        }
    } catch (e) {
        req.auth = undefined
        res.cookie('auth', '', { maxAge: -1, httpOnly: true })
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
        res.cookie('sudo', '', { maxAge: -1, httpOnly: true })
    }
    next()
})

const authRouter = express.Router()

router.use('/account', authRouter)

authRouter.get('/signin', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '..', 'template', 'auth.html'))
})

authRouter.get('/changesecret', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '..', 'template', 'auth.html'))
})

authRouter.get('/challenge', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', '..', 'template', 'auth.html'))
})

authRouter.get('/signout', (req, res, next) => {
    res.cookie('auth', '', { maxAge: -1, httpOnly: true })
    res.redirect('/')
})

export default router
