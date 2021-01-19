import { teacher } from "../teacher/teacher";
import commonApi from "./commonApi";

export enum MyeonbulRequestListType {
    listByUser,
    listByDate,
}

export interface MyeonbulRequestList {
    type: MyeonbulRequestListType;
}

export type MyeonbulRequest = MyeonbulRequestList;

export enum MyeonbulResponseType {
    ACCEPT,
    DENY
}

export interface MyeonbulResponse {
    type: MyeonbulResponseType
}

export interface MyeonbulQueryOne {
    timeRange: {
        begin: number;
        end: number;
        nickname?: string;
    };
    place: string;
    teacher: teacher;
    approved: boolean;
}

export interface MyeonbulQuery extends commonApi {
    data: MyeonbulQueryOne[];
}
