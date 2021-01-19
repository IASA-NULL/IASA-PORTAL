import {Permission} from "./api/auth"

export interface User {
    permission: Permission;
    uid: number;
    id: string;
    pwHash: string;
    email: string;
    name: string;
    penalty?: number;
}
