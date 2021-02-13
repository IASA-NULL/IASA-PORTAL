import express from 'express'
import path from 'path'
import jwt from 'jsonwebtoken'
import getSecret from './util/secret'
import { changePasswordToken } from '../scheme/api/auth'

const authRouter = express.Router()

authRouter.get('/signin', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'template', 'auth.html'))
})

authRouter.get('/changesecret/:token', (req, res, next) => {
    try {
        let token = jwt.verify(
            req.params.token,
            getSecret('token')
        ) as changePasswordToken
        if (token.expire < Date.now()) throw new Error()
        res.sendFile(path.join(__dirname, '..', 'template', 'auth.html'))
    } catch (e) {
        res.sendFile(
            path.join(
                __dirname,
                '..',
                '..',
                'template',
                'changesecretfail.html'
            )
        )
    }
})

authRouter.get('/challenge', (req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'template', 'auth.html'))
})

authRouter.get('/signout', (req, res, next) => {
    res.cookie('auth', '', { maxAge: -1, httpOnly: true })
    res.redirect('/')
})

export default authRouter
