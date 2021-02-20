import express from 'express'

import createResponse from '../createResponse'
import db from '../util/db'
import { DB_CONNECT_ERROR, REQUIRE_PERMISSION_ERROR } from '../../string/error'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const eidList = (await db.get('account', 'id', req.auth.id))?.mail ?? []
        const mailList = await Promise.all(
            eidList.map((el: string) => {
                return db.get('mail', 'eid', el)
            })
        )

        res.send(createResponse(mailList))
    } catch (e) {
        res.status(500)
        res.send(createResponse(false, DB_CONNECT_ERROR))
    }
})

router.get('/:eid', async (req, res) => {
    try {
        const mail = await db.get('mail', 'eid', req.params.eid)
        if (mail.uid !== req.auth.uid) {
            res.status(403)
            res.send(createResponse(false, REQUIRE_PERMISSION_ERROR))
        }
        res.send(createResponse(mail))
    } catch (e) {
        res.status(500)
        res.send(createResponse(false, DB_CONNECT_ERROR))
    }
})

export default router
