export type GID = string

export enum Kind {
    grade = 1,
    first,
    second,
    free,
}

export interface Group {
    gid: GID
    kind: Kind
    name: string
    user?: number[]
}
