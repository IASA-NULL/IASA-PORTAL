import express, {response} from 'express'
import jwt from 'jsonwebtoken'
import {Permission, token} from "../scheme/api/auth"
import getSecret from "./util/secret"

const maxTime = 1000 * 10 * 60 * 60 * 24 * 7
const reSignTime = 1000 * 10 * 60 * 60 * 24 * 3

declare global {
    namespace Express {
        interface Request {
            auth?: token
        }
    }
}

const router = express.Router()

router.use("*", (req, res, next) => {
    try {
        req.auth = jwt.verify(req.cookies.auth, getSecret()) as token
        if (req.auth.expire < Date.now() - reSignTime) {
            res.cookie('auth', jwt.sign({
                name: '이서현',
                id: '04seohyun',
                uid: 20190001,
                code: 20209,
                expire: Date.now() + maxTime,
                permission: Permission.student,
                avatarSrc: '/static/img/avatar.png'
            } as token, getSecret()), {maxAge: maxTime, httpOnly: true, secure: true})
        } else if (req.auth.expire < Date.now()) {
            req.auth = undefined
            res.cookie('auth', '', {maxAge: -1, httpOnly: true})
        }
    } catch (e) {

    }
    next()
})

router.get('/auth', (req, res, next) => {
    res.cookie('auth', jwt.sign({
        name: '이서현',
        id: '04seohyun',
        uid: 20190001,
        code: 20209,
        expire: Date.now() + maxTime,
        permission: Permission.student,
        avatarSrc: '/static/img/avatar.png'
    } as token, getSecret()), {maxAge: maxTime, httpOnly: true})
    res.redirect('/')
})

router.get('/deauth', (req, res, next) => {
    res.cookie('auth', '', {maxAge: -1, httpOnly: true})
    res.redirect('/')
})

export default router
