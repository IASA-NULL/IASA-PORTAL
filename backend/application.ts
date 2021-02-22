import express from 'express'
import path from 'path'
import jwt from 'jsonwebtoken'
import getSecret from './util/secret'
import { changePasswordToken } from '../scheme/api/auth'
import createURL from '../scheme/url'

const applicationRouter = express.Router()

applicationRouter.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'template', 'app.html'))
})

export default applicationRouter
