import express from 'express'
import multer from 'multer'

import createResponse from '../createResponse'

import { upload, download } from '../util/s3'
import db from '../util/db'

const storage = multer.memoryStorage()
const uploadReq = multer({ storage: storage })

const router = express.Router()

router.use((req, res, next) => {
    if (!req.auth) {
        res.status(401)
        res.send(createResponse(false, '먼저 로그인하세요.'))
    } else {
        next()
    }
})

router.post('/upload', uploadReq.any(), async (req, res, next) => {
    try {
        if (!req.files || !req.files.length) {
            res.status(400)
            res.send(createResponse(false, '첨부된 파일이 없어요.'))
            return
        }
        let fileList = [] as string[]
        for (let i of req.files as any) {
            const ext = i.originalname.split('.').pop()
            const fileName = await upload(i.buffer)
            fileList.push(fileName)
            await db.set('upload', {
                id: fileName,
                name: i.originalname,
                ext: ext,
                mime: i.mimetype,
                size: i.size,
            })
        }
        res.send(
            createResponse({
                fileList: fileList,
            })
        )
    } catch (e) {
        res.status(500)
        res.send(createResponse(false, '파일 업로드에 실패했어요.'))
    }
})

router.get('/download/:id', async (req, res, next) => {
    try {
        const fileInfo = await db.get('upload', 'id', req.params.id)
        const fileBody = download(req.params.id)
        res.setHeader(
            'Content-disposition',
            'attachment; filename=' + fileInfo.name
        )
        res.set('Content-Type', fileInfo.mime)
        res.set('Content-Length', fileInfo.size)
        fileBody.pipe(res)
    } catch (e) {
        res.status(404)
        res.send(createResponse(false, '파일이 존재하지 않아요.'))
    }
})

export default router
