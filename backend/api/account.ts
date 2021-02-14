import express from 'express'
import getPath from '../util/getPath'
import db from '../util/db'
import { changePasswordToken, Permission, token } from '../../scheme/api/auth'
import createResponse from '../createResponse'
import jwt from 'jsonwebtoken'
import getSecret, { saltRound } from '../util/secret'
import bcrypt from 'bcrypt'
import _ from 'lodash'
import { getServerToken } from '../util/serverState'
import signupRouter from './signup'
import { User } from '../../scheme/user'
import { getChangePasswordMailHTML, sendMail } from '../util/mail'
import { download } from '../util/s3'
import createURL from '../../scheme/url'
import { TOKEN_EXPIRE_ERROR } from '../../string/error'
import { maxTime, sudoTime, changePasswordTokenExpire } from '../util/tokenTime'

const router = express.Router()
declare const DEV_MODE: boolean

router.use('/signup', signupRouter)

router.get('/info', (req, res, next) => {
    res.send(
        createResponse(
            _.pick(req.auth ?? { permission: Permission.none }, [
                'name',
                'id',
                'uid',
                'code',
                'permission',
                'sudo',
            ])
        )
    )
})

router.post('/username', async (req, res) => {
    let accountInfo = await db.get('account', 'id', req.body.id)
    if (accountInfo) res.send(createResponse(accountInfo.name))
    else {
        res.status(404)
        res.send(createResponse(false, '아이디가 존재하지 않아요.'))
    }
})

router.post('/signin', async (req, res) => {
    let accountInfo = await db.get('account', 'id', req.body.id)
    if (!accountInfo) {
        res.status(404)
        res.send(createResponse(false, '아이디가 존재하지 않아요.'))
    }
    bcrypt
        .compare(req.body.password, accountInfo.pwHash)
        .then((result) => {
            if (result) {
                res.cookie(
                    'auth',
                    jwt.sign(
                        {
                            ..._.pick(accountInfo, [
                                'name',
                                'id',
                                'uid',
                                'code',
                                'permission',
                            ]),
                            expire: new Date().getTime() + maxTime,
                            sid: getServerToken(),
                        } as token,
                        getSecret('token')
                    ),
                    {
                        maxAge: maxTime,
                        httpOnly: true,
                        ...(!DEV_MODE && { domain: '.iasa.kr' }),
                    }
                )
                res.cookie(
                    'sudo',
                    jwt.sign(
                        {
                            expire: new Date().getTime() + sudoTime,
                            sid: getServerToken(),
                        } as token,
                        getSecret('token')
                    ),
                    {
                        maxAge: sudoTime,
                        httpOnly: true,
                        ...(!DEV_MODE && { domain: '.iasa.kr' }),
                    }
                )
                res.send(createResponse(true))
            } else {
                res.status(403)
                res.send(createResponse(false, '비밀번호가 올바르지 않아요.'))
            }
        })
        .catch(() => {
            res.status(500)
            res.send(createResponse(false, '알 수 없는 오류가 발생했어요.'))
        })
})

router.post('/sudo', async (req, res) => {
    let accountInfo = await db.get('account', 'id', req.body.id)
    if (!accountInfo) {
        res.status(404)
        res.send(createResponse(false, '아이디가 존재하지 않아요.'))
    }
    bcrypt
        .compare(req.body.password, accountInfo.pwHash)
        .then((result) => {
            if (result) {
                res.cookie(
                    'sudo',
                    jwt.sign(
                        {
                            expire: new Date().getTime() + sudoTime,
                            sid: getServerToken(),
                        } as token,
                        getSecret('token')
                    ),
                    {
                        maxAge: sudoTime,
                        httpOnly: true,
                        ...(!DEV_MODE && { domain: '.iasa.kr' }),
                    }
                )
                res.send(createResponse(true))
            } else {
                res.status(403)
                res.send(createResponse(false, '비밀번호가 올바르지 않아요.'))
            }
        })
        .catch(() => {
            res.status(500)
            res.send(createResponse(false, '알 수 없는 오류가 발생했어요.'))
        })
})

router.post('/find/id', async (req, res, next) => {
    try {
        let account = (await db.get('account', 'email', req.body.email)) as User
        if (account.name === req.body.name) {
            res.send(
                createResponse({
                    id: account.id,
                })
            )
        } else throw new Error()
    } catch (e) {
        res.status(404)
        res.send(createResponse(false, '일치하는 계정이 존재하지 않아요.'))
    }
})

router.post('/find/password', async (req, res, next) => {
    try {
        let account = (await db.get('account', 'id', req.body.id)) as User
        if (account.email === req.body.email) {
            let token = jwt.sign(
                {
                    id: req.body.id,
                    expire: Date.now() + changePasswordTokenExpire,
                } as changePasswordToken,
                getSecret('token')
            )
            sendMail(
                getChangePasswordMailHTML(
                    createURL('account', 'changesecret', token)
                ),
                'noreply',
                account.email
            )
        }
        res.send(createResponse(true))
    } catch (e) {
        res.status(404)
        res.send(createResponse(false, '일치하는 계정이 존재하지 않아요.'))
    }
})

router.get('/avatar', async (req, res) => {
    try {
        const user = (await db.get('account', 'id', req.auth.id)) as User
        if (!user) throw new Error()
        const fileInfo = await db.get('upload', 'id', user.avatar)
        const fileBody = download(fileInfo.id)
        res.setHeader(
            'Content-disposition',
            'attachment; filename=' + fileInfo.name
        )
        res.set('Content-Type', fileInfo.mime)
        res.set('Content-Length', fileInfo.size)
        fileBody.pipe(res)
    } catch (e) {
        res.sendFile(getPath('static', 'img', 'avatar.png'))
    }
})

router.get('/avatar/:id', async (req, res) => {
    try {
        const user = (await db.get('account', 'id', req.params.id)) as User
        if (!user) throw new Error()
        const fileInfo = await db.get('upload', 'id', user.avatar)
        const fileBody = download(fileInfo.id)
        res.setHeader(
            'Content-disposition',
            'attachment; filename=' + fileInfo.name
        )
        res.set('Content-Type', fileInfo.mime)
        res.set('Content-Length', fileInfo.size)
        fileBody.pipe(res)
    } catch (e) {
        res.sendFile(getPath('static', 'img', 'avatar.png'))
    }
})

router.get('/reqchangesecret', async (req, res, next) => {
    if (!req.auth.sudo) {
        res.redirect(
            createURL(
                'account',
                'challenge?next=' +
                    Buffer.from(
                        createURL('api', 'account', 'reqchangesecret')
                    ).toString('base64')
            )
        )
    }
    res.redirect(
        createURL(
            'account',
            'changesecret',
            jwt.sign(
                {
                    id: req.body.id,
                    expire: Date.now() + changePasswordTokenExpire,
                } as changePasswordToken,
                getSecret('token')
            )
        )
    )
})

router.post('/changesecret', async (req, res, next) => {
    try {
        let token = jwt.verify(
            req.body.token,
            getSecret('token')
        ) as changePasswordToken

        if (token.expire < Date.now()) {
            res.status(408)
            res.send(createResponse(false, TOKEN_EXPIRE_ERROR))
        }
        let account = (await db.get('account', 'id', token.id)) as User
        await db.update('account', 'id', token.id, {
            ...account,
            pwHash: await bcrypt.hash(req.body.password, saltRound),
        })
        res.send(createResponse(true))
    } catch (e) {
        res.status(404)
        res.send(createResponse(false, '일치하는 계정이 존재하지 않아요.'))
    }
})

export default router
