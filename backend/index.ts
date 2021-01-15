import express from 'express'
import compression from 'compression'
import logger from 'morgan'
import path from 'path'
import cookieParser from 'cookie-parser'
import favicon from 'serve-favicon'


import apiRouter from './api/index'
import authRouter from './auth'

import {getServerState} from "./util/serverState"

import helmet from "helmet"


const app = express()

//app.use(helmet())
app.use(cookieParser())

app.use(compression())
app.use(logger('dev'))
app.use(favicon(path.join(__dirname, '..', '..', 'static', 'favicon.ico')))

app.use((req, res, next) => {
    if (req.headers['user-agent'].indexOf("MSIE") > -1 || req.headers['user-agent'].indexOf("rv:") > -1)
        res.sendFile(path.join(__dirname, '..', '..', 'template', 'noIE.html'))
    else next()
})

app.use(((req, res, next) => {
    if (getServerState('build')) {
        res.setHeader('Cache-Control', 'public, max-age=0')
        res.sendFile(path.join(__dirname, '..', '..', 'template', 'building.html'))
    }
    else next()
}))

app.use(authRouter)

app.use('/static', express.static(path.join(__dirname, '..', '..', 'static')))

app.use("/api", apiRouter)


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'template', 'main.html'))
})

app.listen(80, () => {
    console.log("Server is up on port 80.")
})
