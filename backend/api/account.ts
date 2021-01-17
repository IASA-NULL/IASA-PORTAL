import express from 'express'
import {base32Decode} from "@ctrl/ts-base32"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import _ from 'lodash'

import getPath from "../util/getPath"
import db from '../util/db'

import {Permission, token} from "../../scheme/api/auth"
import createResponse from "../createResponse"
import getSecret from "../util/secret"
import {getServerToken} from '../util/serverState'

import signupRouter from './signup'

const maxTime = 1000 * 60 * 60 * 24 * 7
const router = express.Router()

router.use('/signup', signupRouter)

router.get('/info', (req, res, next) => {
    res.send(createResponse(_.pick(req.auth ?? {permission: Permission.none}, ['name', 'id', 'uid', 'code', 'permission'])))
})

router.post('/username', async (req, res, next) => {
    let accountInfo = await db.get('account', 'id', req.body.id)
    if (accountInfo) res.send(createResponse(accountInfo.name))
    else {
        res.status(404)
        res.send(createResponse(false, "아이디가 존재하지 않아요."))
    }
})

router.post('/signin', async (req, res, next) => {
    let accountInfo = await db.get('account', 'id', req.body.id)
    if (!accountInfo) {
        res.status(404)
        res.send(createResponse(false, "아이디가 존재하지 않아요."))
    }
    bcrypt.compare(req.body.password, accountInfo.pwHash).then((result) => {
        if (result) {
            res.cookie('auth', jwt.sign({
                ..._.pick(accountInfo, ['name', 'id', 'uid', 'code', 'permission']),
                expire: Date.now() + maxTime,
                sid: getServerToken()
            } as token, getSecret('token')), {maxAge: maxTime, httpOnly: true})
            res.send(createResponse(true))
        } else {
            res.status(403)
            res.send(createResponse(false, "비밀번호가 올바르지 않아요."))
        }
    }).catch(() => {
        res.status(500)
        res.send(createResponse(false, "알 수 없는 오류가 발생했어요."))
    })
})

router.get('/avatar', (req, res, next) => {
    res.sendFile(getPath('static', 'img', 'avatar.png'))
})

export default router
