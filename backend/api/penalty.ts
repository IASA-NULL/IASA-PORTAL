import express from 'express'

import {Permission} from '../../scheme/api/auth'
import createResponse from '../createResponse'
import db from '../util/db'
import {REQUIRE_SIGNIN_ERROR,} from '../../string/error'
import {User} from "../../scheme/user";

const router = express.Router()

async function getPenaltyInfo(uid: number, req: any, res: any) {
    let account = await db.get('account', 'uid', uid) as User | undefined
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
        account.penalty = {score: 0, history: []}
        db.update('account', 'uid', uid, account)
    }
    res.send(createResponse(account.penalty))
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
    await getPenaltyInfo(req.auth.uid, req, res)
})

router.get('/list/:uid', async (req, res) => {
    const uid = parseInt(req.params.uid)
    if (req.auth.permission === Permission.student && req.auth.uid !== uid) {
        res.status(403)
        res.send(createResponse(false, '다른 학생의 벌점기록은 열람할 수 없어요.'))
        return
    }
    await getPenaltyInfo(uid, req, res)
})

export default router
