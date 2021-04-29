/*
2021 SeoRii®. All right reserved.

auth.ts
사용자 인증부!
** 특히 보안에 주의할 것 **
 */

import express from 'express'
import jwt from 'jsonwebtoken'
import { Permission, SudoToken, token } from '../scheme/api/auth'
import getSecret from './util/secret'
import { getServerToken } from './util/serverState'
import { reSignTime, maxTime, leftTokenTime } from './util/tokenTime'
import createURL from '../scheme/url'
import db from './util/db'
import { User } from '../scheme/user'

declare const DEV_MODE: boolean

// req에 auth 정의
declare global {
    namespace Express {
        interface Request {
            auth?: token
        }
    }
}

const router = express.Router()

router.use('*', async (req, res, next) => {
    let sid = getServerToken()
    try {
        req.auth = jwt.verify(req.cookies.auth, getSecret('token')) as token
        // API용 계정은 토큰 만료 무시!
        if (req.auth.permission !== Permission.api) {
            // SID가 같지 않을 경우 토큰 만료
            if (req.auth.sid !== sid) {
                req.auth.expired = true
                // 리다이렉션
                if (
                    (DEV_MODE &&
                        !req.originalUrl.includes('/api') &&
                        !req.originalUrl.includes('/account')) ||
                    (!DEV_MODE &&
                        req.get('host') !== 'api.iasa.kr' &&
                        req.get('host') !== 'account.iasa.kr')
                ) {
                    res.redirect(
                        createURL('account', 'challenge') +
                            '?next=' +
                            Buffer.from(
                                req.protocol +
                                    '://' +
                                    req.get('host') +
                                    req.originalUrl
                            ).toString('base64')
                    )
                    return
                }
            } //토큰 만료됨
            else if (req.auth.expire < Date.now()) {
                req.auth.expired = true
                // 리다이렉션
                if (
                    (DEV_MODE &&
                        !req.originalUrl.includes('/api') &&
                        !req.originalUrl.includes('/account')) ||
                    (!DEV_MODE &&
                        req.get('host') !== 'api.iasa.kr' &&
                        req.get('host') !== 'account.iasa.kr')
                ) {
                    res.redirect(
                        createURL('account', 'challenge') +
                            '?next=' +
                            Buffer.from(
                                req.protocol +
                                    '://' +
                                    req.get('host') +
                                    req.originalUrl
                            ).toString('base64')
                    )
                    return
                }
            } // 토큰 재서명
            else if (req.auth.expire < Date.now() + reSignTime) {
                res.cookie(
                    'auth',
                    jwt.sign(
                        {
                            ...req.auth,
                            expire: Date.now() + maxTime,
                        },
                        getSecret('token')
                    ),
                    {
                        maxAge: leftTokenTime,
                        httpOnly: true,
                        ...(!DEV_MODE && { domain: '.iasa.kr' }),
                    }
                )
            } else if (req.auth.tokenId !== req.headers['verify']) {
                req.auth = undefined
                next()
                return
            }
        }
    } catch (e) {
        // 토큰 인증 오류!
        req.auth = undefined
        // 토큰 폐기
        res.cookie('auth', '', {
            maxAge: -1,
            httpOnly: true,
            ...(!DEV_MODE && { domain: '.iasa.kr' }),
        })
    }
    try {
        // 사용자 정당성 확인
        let user = (await db.get('account', 'id', req.auth.id)) as
            | User
            | undefined
        if (!user) {
            req.auth = undefined
            res.cookie('auth', '', {
                maxAge: -1,
                httpOnly: true,
                ...(!DEV_MODE && { domain: '.iasa.kr' }),
            })
        }
    } catch (e) {}
    try {
        // SUDO 판별!
        const sudoToken = jwt.verify(
            req.cookies.sudo,
            getSecret('token')
        ) as SudoToken
        if (sudoToken.sid !== sid || sudoToken.expire < Date.now() || !req.auth)
            throw new Error()
        else if (sudoToken.tokenId !== req.headers['verify']) {
            throw new Error()
        }
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
