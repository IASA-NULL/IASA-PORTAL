import express from 'express'
import child_process from 'child_process'

import { Permission } from '../../scheme/api/auth'
import createResponse from '../createResponse'
import { getServerFlag, setServerFlag } from '../util/serverState'
import db from '../util/db'
import { User } from '../../scheme/user'
import { getRandomInt } from '../util/random'
import { base32Encode } from '@ctrl/ts-base32'

const router = express.Router()

router.use((req, res, next) => {
    if (!req.auth) {
        res.status(401)
        res.send(createResponse(false, '먼저 로그인하세요.'))
    } else if (req.auth.permission !== Permission.admin) {
        res.status(403)
        res.send(createResponse(false, '권한이 없어요.'))
    } else {
        next()
    }
})

router.post('/update', (req, res, next) => {
    if (getServerFlag('build')) {
        res.send(createResponse(false, '사이트가 이미 빌드 중이에요.'))
    } else {
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

router.put('/code', async (req, res, next) => {
    let cid
    if (req.body.type === 'S') cid = 0
    else cid = 700
    for (; ; ++cid) {
        const uid = req.body.year + ('000' + cid).substr(-3)
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

router.get('/code', async (req, res, next) => {
    try {
        let codeDB = await db.direct('code')
        codeDB.find({}).toArray((err: any, result: any[]) => {
            if (err) {
                res.status(500)
                res.send(createResponse(false, 'DB에 연결할 수 없어요.'))
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
        res.send(createResponse(false, 'DB에 연결할 수 없어요.'))
    }
})

export default router
