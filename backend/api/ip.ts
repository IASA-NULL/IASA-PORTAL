import express from 'express'

const router = express.Router()

router.get('/ver', async (req, res) => {
    res.send('503')
})

router.get('/link/lastest', async (req, res) => {
    res.send(
        'https://s3.ap-northeast-2.amazonaws.com/public.iasa.kr/IP/bin/IP_5_0_3.exe'
    )
})

export default router
