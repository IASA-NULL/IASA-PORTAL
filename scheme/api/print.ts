import commonApi from './commonApi'

export type PHID = string

export interface PrintHistoryOne {
    cid: string
    sid: number
    count: number
    time: number
    phid: PHID
}

export interface PrintHistory extends Array<PrintHistoryOne> {}

export interface PrintHistoryResponse extends commonApi {
    data: PrintHistory
}
