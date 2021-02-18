import express from 'express'

import { Permission } from '../../scheme/api/auth'
import createResponse from '../createResponse'
import db from '../util/db'
import { REQUIRE_SIGNIN_ERROR } from '../../string/error'
import { User, UserInfo } from '../../scheme/user'
import { PenaltyResponseOne } from '../../scheme/api/penalty'

const router = express.Router()

async function getPenaltyInfo(uid: number, res: any) {
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
    if (!account.penalty) {
        account.penalty = { score: 0, history: [] }
        await db.update('account', 'uid', uid, { penalty: account.penalty })
    }
    res.send(createResponse(account.penalty))
}

async function addPenalty(uid: number, info: PenaltyResponseOne, res: any) {
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
    if (!account.penalty) account.penalty = { score: 0, history: [] }
    account.penalty.score += info.score
    account.penalty.history.unshift(info)
    await db.update('account', 'uid', uid, { penalty: account.penalty })
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

router.get('/list', async (req, res) => {
    await getPenaltyInfo(req.auth.uid, res)
})

router.get('/list/:uid', async (req, res) => {
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

export default router
