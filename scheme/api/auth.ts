export enum Permission {
    none = 1,
    student,
    teacher,
    admin,
}

export interface token {
    id: string;
    uid: number;
    code: number;
    name: string;
    expire: number;
    permission: Permission;
    sid: string;
}

export interface signupToken {
    type: Permission,
    uid: number,
    id: string,
    password: string,
    email: string,
    name: string,
    expire: number
}
