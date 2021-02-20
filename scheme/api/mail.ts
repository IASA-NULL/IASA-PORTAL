import { ParsedMail } from 'mailparser'
import commonApi from './commonApi'

export interface MailDB extends ParsedMail {
    eid: string
    uid: number
}

export interface MailListResponse extends commonApi {
    data: MailDB[]
}

export interface MailResponse extends commonApi {
    data: MailDB
}
