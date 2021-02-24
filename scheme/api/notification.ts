import commonApi from './commonApi'

export interface NotificationOne {
    uid: number
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
