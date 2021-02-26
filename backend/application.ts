import express from 'express'
import path from 'path'

const applicationRouter = express.Router()

applicationRouter.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'template', 'app.html'))
})

export default applicationRouter
