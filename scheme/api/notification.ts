import commonApi from './commonApi'
import { UID } from '../user'

export interface NotificationOne {
    uid: UID
    title: string
    subtitle: string
    link: string
    avatar: string
    time: number
    nid: string
    read: boolean
}

export interface Notifications extends Array<NotificationOne> {}

export interface OneDayNotifications {
    date: number
    notifications: Notifications
}

export interface NotificationApi extends commonApi {
    data: OneDayNotifications[]
}
