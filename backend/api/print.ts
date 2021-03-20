import express from 'express'

import { Permission } from '../../scheme/api/auth'
import createResponse from '../createResponse'
import db from '../util/db'
import {
    REQUIRE_PERMISSION_ERROR,
    REQUIRE_SIGNIN_ERROR,
} from '../../string/error'

const router = express.Router()

async function addPrint(sid: number, count: number, cid: string, res: any) {
    await db.set('print', {
        sid: sid,
        count: count,
        cid: cid,
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

router.get('/list', async (req, res) => {
    if (req.auth.permission === Permission.student) {
        res.status(403)
        res.send(createResponse(false, REQUIRE_PERMISSION_ERROR))
        return
    }
    const printDB = await db.direct('print')
    const printHistory = await printDB
        .find()
        .sort('_id', -1)
        .limit(40)
        .toArray()
    res.send(createResponse(printHistory))
})

router.post('/', async (req, res) => {
    if (req.auth.permission === Permission.student) {
        res.status(403)
        res.send(createResponse(false, REQUIRE_PERMISSION_ERROR))
        return
    }
    await addPrint(req.body.sid, req.body.paperCount, req.body.cid, res)
})

export default router
