import express from 'express'

const router = express.Router()

router.get('/ver', async (req, res) => {
    res.send('501')
})

router.get('/link/lastest', async (req, res) => {
    res.send(
        'https://s3.ap-northeast-2.amazonaws.com/public.iasa.kr/IP/bin/IP_5_0_1.exe'
    )
})

export default router
