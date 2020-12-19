import express from 'express'
import compression from 'compression'
import logger from 'morgan'
import path from 'path'
import cookieParser from 'cookie-parser'
import favicon from 'serve-favicon'


const app = express()

app.use(cookieParser())

app.use(compression())
app.use(logger('dev'))
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')))
app.use('/static', express.static(path.join(__dirname, '..', 'static')))

app.get("*", (req, res) => {
    req.cookies.auth
    res.sendFile(path.join(__dirname, '..', 'template', 'main.html'))
})

app.listen(80, () => {
    console.log("Server is up on port 80.")
})
