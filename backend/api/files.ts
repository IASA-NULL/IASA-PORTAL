import express from 'express'
import multer from 'multer'

import createResponse from '../createResponse'

import { upload, downloadAsStream } from '../util/s3'
import db from '../util/db'
import {
    FAIL_UPLOAD_ERROR,
    NO_FILE_ERROR,
    NO_FOUND_FILE_ERROR,
    REQUIRE_SIGNIN_ERROR,
} from '../../string/error'
import { getDownloadFilename } from '../util/encode'

const storage = multer.memoryStorage()
const uploadReq = multer({ storage: storage })

const router = express.Router()

router.post('/upload', uploadReq.any(), async (req, res) => {
    try {
        if (!req.files || !req.files.length) {
            res.status(400)
            res.send(createResponse(false, NO_FILE_ERROR))
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
        res.send(createResponse(false, FAIL_UPLOAD_ERROR))
    }
})

router.use((req, res, next) => {
    if (!req.auth) {
        res.status(401)
        res.send(createResponse(false, REQUIRE_SIGNIN_ERROR))
    } else {
        next()
    }
})

router.get('/download/:id', async (req, res) => {
    try {
        const fileInfo = await db.get('upload', 'id', req.params.id)
        const fileBody = downloadAsStream(req.params.id)
        res.setHeader(
            'Content-disposition',
            'attachment; filename=' + getDownloadFilename(fileInfo.name, req)
        )
        res.set('Content-Type', fileInfo.mime)
        res.set('Content-Length', fileInfo.size)
        fileBody.pipe(res)
    } catch (e) {
        res.status(404)
        res.send(createResponse(false, NO_FOUND_FILE_ERROR))
    }
})

export default router
