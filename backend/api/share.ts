import express from 'express'

import { Permission } from '../../scheme/api/auth'
import createResponse from '../createResponse'
import { getServerFlag, setServerFlag } from '../util/serverState'
import db from '../util/db'
import { User } from '../../scheme/user'
import { getRandomCode, getRandomInt } from '../util/random'
import { base32Encode } from '@ctrl/ts-base32'
import {
    ALREADY_BUILDING_ERROR,
    DB_CONNECT_ERROR,
    REQUIRE_PERMISSION_ERROR,
    REQUIRE_SIGNIN_ERROR,
    REQUIRE_SUDO_ERROR,
} from '../../string/error'

const router = express.Router()

router.post('/upload', async (req, res, next) => {
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

router.get('/:code', async (req, res, next) => {
    const info = await db.get('share', 'code', req.params.code)
    if (info) res.send(createResponse(info.files))
    else {
        res.status(404)
        res.send(createResponse(false, '코드가 올바르지 않아요.'))
    }
})

export default router
