import express from 'express'

import {Permission, token} from "../../scheme/api/auth"
import createResponse from "../createResponse"
import jwt from "jsonwebtoken"
import getSecret from "../util/secret"

const router = express.Router()

router.use((req, res, next) => {
    if (!req.auth) {
        res.status(403)
        res.send(createResponse(false, "먼저 로그인하세요."))
    } else {
        next()
    }
})

export default router
