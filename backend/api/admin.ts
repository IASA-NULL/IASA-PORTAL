import express from 'express'
import child_process, { exec } from 'child_process'

import { Permission } from '../../scheme/api/auth'
import createResponse from '../createResponse'
import { getServerFlag, setServerFlag } from '../util/serverState'
import db from '../util/db'
import { UID, User } from '../../scheme/user'
import { getRandomInt } from '../util/random'
import { base32Encode } from '@ctrl/ts-base32'
import {
    ALREADY_BUILDING_ERROR,
    DB_CONNECT_ERROR,
    REQUIRE_PERMISSION_ERROR,
    REQUIRE_SIGNIN_ERROR,
    REQUIRE_SUDO_ERROR,
} from '../../string/error'
import { createNotify } from '../util/notification'

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
            `${req.body.branch} 브랜치로 업데이트했어요.`,
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
    if (!req.auth || req.auth.permission !== Permission.admin) {
        res.status(403)
        res.send(createResponse(false, REQUIRE_PERMISSION_ERROR))
    }
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

export default router
