import express from 'express'

import { Permission } from '../../scheme/api/auth'
import createResponse from '../createResponse'
import db from '../util/db'
import {
    REQUIRE_PERMISSION_ERROR,
    REQUIRE_SIGNIN_ERROR,
} from '../../string/error'
import { UID, User, UserInfo } from '../../scheme/user'
import { PenaltyResponseOne, PID } from '../../scheme/api/penalty'
import { v4 as uuid } from 'uuid'
import { createNotify } from '../util/notification'
import { PENALTY_GOT } from '../../string/notify'

const router = express.Router()

async function getPenaltyInfo(uid: UID, res: any) {
    let account = (await db.get('account', 'uid', uid)) as User | undefined
    if (!account) {
        res.status(404)
        res.send(createResponse(false, '올바르지 않은 사용자에요.'))
        return
    }
    if (account.permission !== Permission.student) {
        res.status(404)
        res.send(createResponse(false, '대상 계정이 학생이 아니에요.'))
        return
    }
    let penalty = account.penalty
    if (!penalty) {
        penalty = 0
        await db.update('account', 'uid', uid, { penalty: penalty })
    }

    const penaltyDB = await db.direct('penalty')
    const penaltyHistory = await penaltyDB
        .find({ uid: uid })
        .sort('_id', -1)
        .limit(40)
        .toArray()
    res.send(
        createResponse({
            score: penalty,
            history: penaltyHistory,
        })
    )
}

async function addPenalty(uid: UID, info: PenaltyResponseOne, res: any) {
    let account = (await db.get('account', 'uid', uid)) as User | undefined
    if (!account) {
        res.status(404)
        res.send(createResponse(false, '올바르지 않은 사용자에요.'))
        return
    }
    if (account.permission !== Permission.student) {
        res.status(404)
        res.send(createResponse(false, '대상 계정이 학생이 아니에요.'))
        return
    }
    let penalty = account.penalty
    if (!penalty) penalty = 0
    info.pid = uuid()
    info.uid = uid
    info.target = {
        name: account.name,
        uid: uid,
        type: account.permission,
    }
    penalty += info.score
    await db.update('account', 'uid', uid, { penalty: penalty })
    await db.set('penalty', info)
    res.send(createResponse(true))
    createNotify(
        [uid],
        PENALTY_GOT(info.score),
        '자세한 내용을 보려면 이 링크를 누르세요.',
        '/penalty'
    )
}

async function deletePenalty(pid: PID, res: any) {
    const penaltyInfo = (await db.get(
        'penalty',
        'pid',
        pid
    )) as PenaltyResponseOne
    if (!penaltyInfo) {
        res.status(404)
        res.send(createResponse(false, '올바르지 않은 벌점 ID에요.'))
        return
    }
    const account = (await db.get(
        'account',
        'uid',
        penaltyInfo.target.uid
    )) as User
    if (!account) {
        res.status(404)
        res.send(createResponse(false, '올바르지 않은 사용자에요.'))
        return
    }
    let penalty = account.penalty
    if (!penalty) penalty = 0
    penalty -= penaltyInfo.score
    await db.del('penalty', 'pid', pid)
    await db.update('account', 'uid', penaltyInfo.target.uid, {
        penalty: penalty,
    })
    res.send(createResponse(true))
}

router.use((req, res, next) => {
    if (!req.auth) {
        res.status(401)
        res.send(createResponse(false, REQUIRE_SIGNIN_ERROR))
    } else {
        next()
    }
})

router.get('/', async (req, res) => {
    await getPenaltyInfo(req.auth.uid, res)
})

router.get('/list', async (req, res) => {
    if (req.auth.permission === Permission.student) {
        res.status(403)
        res.send(createResponse(false, REQUIRE_PERMISSION_ERROR))
        return
    }
    const penaltyDB = await db.direct('penalty')
    const penaltyHistory = await penaltyDB
        .find()
        .sort('_id', -1)
        .limit(40)
        .toArray()
    res.send(createResponse(penaltyHistory))
})

router.get('/:uid', async (req, res) => {
    const uid = parseInt(req.params.uid)
    if (req.auth.permission === Permission.student && req.auth.uid !== uid) {
        res.status(403)
        res.send(
            createResponse(false, '다른 학생의 벌점기록은 열람할 수 없어요.')
        )
        return
    }
    await getPenaltyInfo(uid, res)
})

router.post('/', async (req, res) => {
    if (req.auth.permission === Permission.student) {
        res.status(403)
        res.send(createResponse(false, REQUIRE_PERMISSION_ERROR))
        return
    }
    await addPenalty(
        req.body.uid,
        {
            score: req.body.score,
            info: req.body.reason,
            teacher: { name: req.auth.name, uid: req.auth.uid } as UserInfo,
            time: Date.now(),
        } as PenaltyResponseOne,
        res
    )
})

router.delete('/:pid', async (req, res) => {
    if (req.auth.permission === Permission.student) {
        res.status(403)
        res.send(createResponse(false, REQUIRE_PERMISSION_ERROR))
        return
    }
    await deletePenalty(req.params.pid, res)
})

export default router
