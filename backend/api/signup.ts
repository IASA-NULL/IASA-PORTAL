import bcrypt from 'bcrypt'
import { Permission, signupToken } from '../../scheme/api/auth'
import createResponse from '../createResponse'
import { getVerificationMailHTML, sendMail } from '../util/mail'
import express from 'express'
import jwt from 'jsonwebtoken'
import getSecret, { saltRound } from '../util/secret'
import createURL from '../../scheme/url'
import path from 'path'
import db from '../util/db'
import { User } from '../../scheme/user'
import { DB_CONNECT_ERROR } from '../../string/error'
import { signupTokenExpire } from '../util/tokenTime'

const router = express.Router()

router.post('/verify', async (req, res, next) => {
    let errRes = false

    let tmpUser

    try {
        tmpUser = await db.get('code', 'code', req.body.code)
        if (!tmpUser) {
            res.status(409)
            res.send(createResponse(false, '코드가 올바르지 않아요.'))
            return
        }
    } catch (e) {
        res.status(500)
        res.send(createResponse(false, '코드가 올바르지 않아요.'))
        return
    }

    try {
        if (
            req.body.type !== Permission.student &&
            req.body.type !== Permission.teacher
        )
            errRes = true
        if (req.body.type !== tmpUser.type) errRes = true
    } catch (e) {
        errRes = true
    }

    if (errRes) {
        res.status(403)
        res.send(createResponse(false, '코드가 올바르지 않아요.'))
        return
    } else {
        res.send(
            createResponse({
                type: req.body.type,
                uid: tmpUser.uid,
            })
        )
        return
    }
})

router.post('/mail', async (req, res, next) => {
    let errRes = false

    let tmpUser

    try {
        tmpUser = await db.get('code', 'code', req.body.code)
        if (!tmpUser) {
            res.status(409)
            res.send(createResponse(false, '코드가 올바르지 않아요.'))
            return
        }
    } catch (e) {
        res.status(500)
        res.send(createResponse(false, '코드가 올바르지 않아요.'))
        return
    }

    try {
        if (
            req.body.type !== Permission.student &&
            req.body.type !== Permission.teacher
        )
            errRes = true
        if (req.body.type !== tmpUser.type) errRes = true
    } catch (e) {
        errRes = true
    }

    if (errRes) {
        res.status(403)
        res.send(createResponse(false, '코드가 올바르지 않아요.'))
        return
    }

    try {
        let user = await db.get('account', 'id', req.body.id.toLowerCase())
        if (user) {
            res.status(409)
            res.send(createResponse(false, '아이디가 같은 계정이 있어요.'))
            return
        }

        user = (await db.get('account', 'email', req.body.email)) as
            | User
            | undefined
        if (user) {
            res.status(409)
            res.send(createResponse(false, '이메일이 같은 계정이 있어요.'))
            return
        }

        await db.update('code', 'code', req.body.code, {
            ...tmpUser,
            id: req.body.id.toLowerCase(),
            pwHash: await bcrypt.hash(req.body.password, saltRound),
            email: req.body.email,
        })
    } catch (e) {
        res.status(500)
        res.send(createResponse(false, DB_CONNECT_ERROR))
        return
    }

    let token = jwt.sign(
        {
            uid: tmpUser.uid,
            expire: Date.now() + signupTokenExpire,
        } as signupToken,
        getSecret('token')
    )

    let mailRes = await sendMail(
        getVerificationMailHTML(
            createURL('api', 'account', 'signup', 'finalize', token)
        ),
        'noreply',
        req.body.email
    )
    if (mailRes) res.send(createResponse(true))
    else {
        res.status(500)
        res.send(createResponse(false, '인증 메일을 보내지 못했어요.'))
        return
    }
})

router.get('/finalize/:token', async (req, res, next) => {
    try {
        let token = jwt.verify(
            req.params.token,
            getSecret('token')
        ) as signupToken
        if (token.expire < Date.now()) {
            res.sendFile(
                path.join(
                    __dirname,
                    '..',
                    '..',
                    '..',
                    'template',
                    'signup',
                    'fail.html'
                )
            )
            return
        }

        let user = (await db.get('account', 'uid', token.uid)) as
            | User
            | undefined
        if (user) {
            res.status(412)
            res.sendFile(
                path.join(
                    __dirname,
                    '..',
                    '..',
                    '..',
                    'template',
                    'signup',
                    'already.html'
                )
            )
            return
        }

        let tmpUser = await db.get('code', 'uid', token.uid)

        if (!tmpUser) throw new Error()
        await db.del('code', 'uid', token.uid)
        await db.set('account', {
            permission: tmpUser.type,
            uid: tmpUser.uid,
            id: tmpUser.id,
            pwHash: tmpUser.pwHash,
            email: tmpUser.email,
            name: tmpUser.name,
            avatar: tmpUser.avatar,
        } as User)

        res.sendFile(
            path.join(
                __dirname,
                '..',
                '..',
                '..',
                'template',
                'signup',
                'success.html'
            )
        )
        return
    } catch (e) {
        res.status(400)
        res.sendFile(
            path.join(
                __dirname,
                '..',
                '..',
                '..',
                'template',
                'signup',
                'fail.html'
            )
        )
        return
    }
})

export default router
