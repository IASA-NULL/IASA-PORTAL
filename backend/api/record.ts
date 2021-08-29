import { Permission } from '../../scheme/api/auth'
import createResponse from '../createResponse'
import {
    DB_CONNECT_ERROR,
    NO_FOUND_FILE_ERROR,
    REQUIRE_PERMISSION_ERROR,
} from '../../string/error'
import db from '../util/db'
import express from 'express'
import { uuid, getRandomCode } from '../util/random'
import createURL from '../../scheme/url'

const router = express.Router()

router.get('/', async (req, res) => {
    const rid = uuid(),
        code = getRandomCode(6)
    try {
        await db.set('record_meta', {
            time: Date.now(),
            rid,
            code,
            duration: 0,
        })
        res.send(createResponse({ rid, code }))
    } catch (e) {
        res.send(createResponse(false, DB_CONNECT_ERROR))
    }
})

router.post('/', async (req, res) => {
    try {
        const rid = req.body.rid,
            vid = req.body.vid,
            time = req.body.time,
            duration = req.body.duration
        await db.set('record', { time, rid, vid })
        const dur = (await db.get('record_meta', 'rid', rid)).duration
        await db.update('record_meta', 'rid', rid, { duration: dur + duration })
        res.send(createResponse(true))
    } catch (e) {
        res.send(createResponse(false, DB_CONNECT_ERROR))
    }
})

router.get('/:code', async (req, res) => {
    try {
        const rinfo = await db.get('record_meta', 'code', req.params.code)
        const recordDB = await db.direct('record')
        const list = (
            await recordDB.find({ rid: rinfo.rid }).sort('time', 1).toArray()
        ).map((x: any) => {
            return createURL('api', 'files', 'download', x.vid)
        })
        res.send(createResponse({ list, duration: rinfo.duration }))
    } catch (e) {
        res.status(404)
        res.send(createResponse(false, '코드가 올바르지 않아요.'))
    }
})

export default router
