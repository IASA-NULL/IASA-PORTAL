import express from 'express'

import { Permission } from '../../scheme/api/auth'
import createResponse from '../createResponse'
import db from '../util/db'
import {
    REQUIRE_PERMISSION_ERROR,
    REQUIRE_SIGNIN_ERROR,
} from '../../string/error'
import { PHID, PrintHistoryOne } from '../../scheme/api/print'
import { uuid } from '../util/random'

const router = express.Router()

async function addPrint(sid: number, count: number, cid: string, res: any) {
    await db.set('print', {
        sid: sid,
        count: count,
        cid: cid,
        phid: uuid(),
        time: Date.now(),
    } as PrintHistoryOne)
    res.send(createResponse(true))
}
async function deletePrint(phid: PHID, res: any) {
    await db.del('print', 'phid', phid)
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

router.delete('/:phid', async (req, res) => {
    if (req.auth.permission === Permission.student) {
        res.status(403)
        res.send(createResponse(false, REQUIRE_PERMISSION_ERROR))
        return
    }
    await deletePrint(req.params.phid, res)
})

export default router
