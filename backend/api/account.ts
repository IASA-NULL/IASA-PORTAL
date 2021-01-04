import express from 'express'

import {Permission, token} from "../../scheme/api/auth"
import createResponse from "../createResponse"
import jwt from "jsonwebtoken";
import getSecret from "../util/secret";

const maxTime = 1000 * 60 * 60 * 24 * 7
const router = express.Router()

router.get('/info', (req, res, next) => {
    res.send(createResponse(req.auth ?? {permission: Permission.none}))
})

router.post('/username', (req, res, next) => {
    if (req.body.id === 'hi') res.send(createResponse('이서현'))
    else {
        res.status(404)
        res.send(createResponse(false, "아이디가 존재하지 않아요."))
    }
})

router.post('/signin', (req, res, next) => {
    if (req.body.id === 'hi' && req.body.password === 'pass') {
        res.cookie('auth', jwt.sign({
            name: '이서현',
            id: '04seohyun',
            uid: 20190001,
            code: 20209,
            expire: Date.now() + maxTime,
            permission: Permission.student,
            avatarSrc: '/static/img/avatar.png'
        } as token, getSecret()), {maxAge: maxTime, httpOnly: true})
        res.send(createResponse(true))
    } else {
        res.status(403)
        res.send(createResponse(false, "비밀번호가 올바르지 않아요."))
    }
})

export default router
