import { downloadAsStream, fileList, remove } from './util/s3'
import mailParser from 'mailparser'
import db from './util/db'
import { User } from '../scheme/user'
import { v4 as uuid } from 'uuid'

export default function () {
    fileList('mail/', 'mail').then((res) => {
        res.Contents.forEach(async (el) => {
            const id = el.Key.split('/')[1]
            if (!id) return
            const user = (await db.get('account', 'id', id)) as User
            if (!user) {
                if (el.Key.split('/')[2]) remove(el.Key, 'mail')
                return
            }
            const mail = user.mail ?? []
            mailParser
                .simpleParser(downloadAsStream(el.Key, 'mail'))
                .then(async (parsed) => {
                    const mailId = uuid()
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
