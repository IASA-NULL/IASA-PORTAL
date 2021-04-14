/*
2021 SeoRii®. All right reserved.

mailParse.ts
S3(mail.iasa.kr)에 쌓여있는 메일 가져오기!

TODO: 첨부파일 파싱해서 upload
 */

import { downloadAsStream, fileList, remove } from './util/s3'
import mailParser from 'mailparser'
import db from './util/db'
import { User } from '../scheme/user'
import { uuid } from './util/random'

export default function mailParse() {
    // s3 탐색
    fileList('mail/', 'mail').then((res) => {
        res.Contents.forEach(async (el) => {
            // 메일 ID(mid)
            const id = el.Key.split('/')[1]
            if (!id) return
            const user = (await db.get('account', 'id', id)) as User
            if (!user) {
                if (el.Key.split('/')[2]) remove(el.Key, 'mail')
                return
            }
            const mail = user.mail ?? []

            // 메일 파싱
            mailParser
                .simpleParser(downloadAsStream(el.Key, 'mail'))
                .then(async (parsed) => {
                    const mailId = uuid()

                    // DB에다가 집어넣기!
                    await db.set('mail', {
                        ...parsed,
                        eid: mailId,
                        uid: user.uid,
                    })
                    mail.unshift(mailId)
                    await db.update('account', 'id', id, { mail: mail })
                    remove(el.Key, 'mail')
                })
        })
    })
}
