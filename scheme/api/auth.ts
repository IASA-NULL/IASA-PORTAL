export enum Permission {
    none = 1,
    student,
    teacher,
    admin
}

export interface token {
    id: string,
    uid: number,
    code: number,
    name: string,
    expire: number,
    permission: Permission,
    avatarSrc: string
}
