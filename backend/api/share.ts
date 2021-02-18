import express from 'express'

import createResponse from '../createResponse'
import db from '../util/db'
import { getRandomCode } from '../util/random'
import { REQUIRE_SIGNIN_ERROR } from '../../string/error'

const router = express.Router()

router.post('/upload', async (req, res) => {
    const code = getRandomCode(6)

    await db.set('share', {
        files: req.body.files,
        code: code,
    })

    res.send(
        createResponse({
            code: code,
        })
    )
    return
})

router.use((req, res, next) => {
    if (!req.auth) {
        res.status(401)
        res.send(createResponse(false, REQUIRE_SIGNIN_ERROR))
    } else {
        next()
    }
})

router.get('/:code', async (req, res) => {
    const info = await db.get('share', 'code', req.params.code)
    if (info) res.send(createResponse(info.files))
    else {
        res.status(404)
        res.send(createResponse(false, '코드가 올바르지 않아요.'))
    }
})

export default router
