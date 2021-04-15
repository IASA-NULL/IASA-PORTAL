import express from 'express'
import child_process, { exec } from 'child_process'

import { Permission } from '../../scheme/api/auth'
import createResponse from '../createResponse'
import { getServerFlag, setServerFlag } from '../util/serverState'
import db from '../util/db'
import { UID, User } from '../../scheme/user'
import { getRandomInt, uuid } from '../util/random'
import { base32Encode } from '@ctrl/ts-base32'
import {
    ALREADY_BUILDING_ERROR,
    DB_CONNECT_ERROR,
    REQUIRE_PERMISSION_ERROR,
    REQUIRE_SIGNIN_ERROR,
    REQUIRE_SUDO_ERROR,
} from '../../string/error'
import { createNotify } from '../util/notification'
import bcrypt from 'bcrypt'
import getSecret, { saltRound } from '../util/secret'
import fetch from 'node-fetch'

const router = express.Router()

router.use((req, res, next) => {
    if (!req.auth) {
        res.status(401)
        res.send(createResponse(false, REQUIRE_SIGNIN_ERROR))
    } else if (req.auth.permission !== Permission.admin) {
        res.status(403)
        res.send(createResponse(false, REQUIRE_PERMISSION_ERROR))
    } else {
        next()
    }
})

router.post('/update', (req, res) => {
    if (!req.auth.sudo) {
        res.status(403)
        res.send(createResponse(false, REQUIRE_SUDO_ERROR))
    }
    if (getServerFlag('build')) {
        res.send(createResponse(false, ALREADY_BUILDING_ERROR))
    } else {
        createNotify(
            [1],
            '서버를 업데이트했어요.',
            `${req.body.info} 브랜치로 업데이트했어요.`,
            ''
        )
        setServerFlag('build')
        res.send(createResponse(true))
        child_process.spawn(
            'cmd',
            [
                '/c',
                'start',
                'cmd',
                '/c',
                'C:\\Util\\update_server.bat',
                req.body.branch,
            ],
            {
                detached: true,
                stdio: ['ignore', 'ignore', 'ignore'],
            }
        )
    }
})

router.put('/code', async (req, res) => {
    let cid
    if (req.body.type === 'S') cid = 0
    else cid = 700
    for (; ; ++cid) {
        const uid = parseInt(req.body.year + ('0000' + cid).substr(-4)) as UID
        try {
            let user = (await db.get('account', 'uid', uid)) as User | undefined
            if (user) continue
            user = (await db.get('code', 'uid', uid)) as User | undefined
            if (user) continue
        } catch (e) {
            continue
        }
        let code = 'C' + req.body.type + uid
        while (code.length < 15) {
            let idx = getRandomInt(2, code.length)
            code =
                code.substr(0, idx) +
                ['C', 'O', 'D', 'E'][getRandomInt(0, 4)] +
                code.substr(idx)
        }

        const codeEncoded = base32Encode(Buffer.from(code))

        await db.set('code', {
            uid: uid,
            type:
                req.body.type === 'S' ? Permission.student : Permission.teacher,
            avatar: req.body.avatar,
            name: req.body.name,
            code: codeEncoded,
            gender: req.body.gender,
        })

        res.send(
            createResponse({
                code: codeEncoded,
            })
        )
        return
    }
})

router.get('/code', async (req, res) => {
    try {
        let codeDB = await db.direct('code')
        codeDB.find({}).toArray((err: any, result: any[]) => {
            if (err) {
                res.status(500)
                res.send(createResponse(false, DB_CONNECT_ERROR))
            } else {
                res.send(
                    createResponse({
                        codeList: result,
                    })
                )
            }
        })
    } catch (e) {
        res.status(500)
        res.send(createResponse(false, DB_CONNECT_ERROR))
    }
})

router.delete('/code/:code', async (req, res) => {
    try {
        let user = await db.get('code', 'code', req.params.code)
        if (!user) {
            res.status(404)
            res.send(
                createResponse(
                    false,
                    '올바른 코드가 아니거나 이미 사용되었어요.'
                )
            )
            return
        }
    } catch (e) {
        res.send(createResponse(false, DB_CONNECT_ERROR))
        return
    }
    await db.del('code', 'code', req.params.code)
    res.send(createResponse(true))
})

router.get('/current', async (req, res) => {
    try {
        exec(
            'git show --oneline -s',
            {
                cwd: 'C:\\Server\\IASA-PORTAL',
            },
            function (error, current, stderr) {
                exec(
                    'git branch --show-current',
                    {
                        cwd: 'C:\\Server\\IASA-PORTAL',
                    },
                    function (error, branch, stderr) {
                        let li = current.trim().split(' ')
                        const code = li.shift()
                        res.send(
                            createResponse({
                                branch: branch.trim(),
                                head: code,
                                message: li.join(' '),
                            })
                        )
                    }
                )
            }
        )
    } catch (e) {
        res.status(500)
        res.send(createResponse(false, DB_CONNECT_ERROR))
    }
})

router.post('/api', async (req, res) => {
    const id = 'api_' + req.body.id
    try {
        let user = (await db.get('account', 'id', id)) as User | undefined
        if (user) {
            res.send(createResponse(false, '중복되는 ID에요.'))
            return
        }
    } catch (e) {
        res.send(createResponse(false, DB_CONNECT_ERROR))
        return
    }

    const password = Array(10)
        .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
        .map(function (x) {
            return x[Math.floor(Math.random() * x.length)]
        })
        .join('')

    await db.set('account', {
        id: id,
        permission: Permission.api,
        pwHash: await bcrypt.hash(password, saltRound),
        name: id,
        createTime: Date.now(),
    })

    res.send(createResponse(password))
})

router.get('/api', async (req, res) => {
    const accountDB = await db.direct('account')
    const accountHistory = await accountDB
        .find({ permission: Permission.api })
        .sort('_id', -1)
        .limit(40)
        .toArray()

    res.send(createResponse(accountHistory))
})

router.delete('/api/:id', async (req, res) => {
    try {
        let user = (await db.get('account', 'id', req.params.id)) as
            | User
            | undefined
        if (!user) {
            res.status(404)
            res.send(createResponse(false, '계정이 없어요.'))
            return
        }
        if (user.permission !== Permission.api) {
            res.send(createResponse(false, 'API 계정이 아니에요.'))
            return
        }
    } catch (e) {
        res.send(createResponse(false, DB_CONNECT_ERROR))
        return
    }
    await db.del('account', 'id', req.params.id)
    res.send(createResponse(true))
})

router.get('/sl', async (req, res) => {
    let fr = await fetch('https://sl.iasa.kr/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ password: getSecret('sl') }),
    })
    let data = await fr.json()
    res.send(createResponse(data.data))
})

export default router
