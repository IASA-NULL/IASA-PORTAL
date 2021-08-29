/*
2021 SeoRii®. All right reserved.

application.ts
기타 출력용 페이지 라우팅!

TODO : 가입 코드도 Application으로 만들기!
 */

import express from 'express'
import path from 'path'

const applicationRouter = express.Router()

applicationRouter.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'static', 'html', 'app.html'))
})

export default applicationRouter
