import { ParsedMail } from 'mailparser'
import commonApi from './commonApi'
import { UID } from '../user'

export interface MailDB extends ParsedMail {
    eid: string
    uid: UID
}

export interface MailListResponse extends commonApi {
    data: MailDB[]
}

export interface MailResponse extends commonApi {
    data: MailDB
}
