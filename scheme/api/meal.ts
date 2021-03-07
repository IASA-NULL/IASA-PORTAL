import commonApi from './commonApi'

export enum AllergicInfo {
    난류 = 1,
    유유,
    메밀,
    땅콩,
    대두,
    밀,
    고등어,
    게,
    새우,
    돼지고기,
    복숭아,
    토마토,
    아황산류,
    호두,
    닭고기,
    쇠고기,
    오징어,
    조개류,
    잣,
}

export interface mealTime {
    type: number
    year: number
    month: number
    day: number
}

export function getMealTime(date = new Date()) {
    let type, year, month, day
    if (
        date.getHours() < 8 ||
        (date.getHours() === 8 && date.getMinutes() <= 20)
    )
        type = 0
    else if (
        date.getHours() < 13 ||
        (date.getHours() === 13 && date.getMinutes() <= 20)
    )
        type = 1
    else if (
        date.getHours() < 19 ||
        (date.getHours() === 19 && date.getMinutes() <= 20)
    )
        type = 2
    else {
        date = new Date(date.getTime() + 1000 * 3600 * 24)
        type = 0
    }
    year = date.getFullYear()
    month = date.getMonth() + 1
    day = date.getDate()
    return {
        year: year,
        month: month,
        day: day,
        type: type,
    }
}

export function getPrevMealTime(target: mealTime) {
    let { type, year, month, day } = target
    type -= 1
    if (type < 0) {
        type = 2
        let nextDay = new Date(year, month - 1, day - 1)
        year = nextDay.getFullYear()
        month = nextDay.getMonth() + 1
        day = nextDay.getDate()
    }
    return {
        year: year,
        month: month,
        day: day,
        type: type,
    }
}

export function getNextMealTime(target: mealTime) {
    let { type, year, month, day } = target
    type += 1
    if (type > 2) {
        type = 0
        let nextDay = new Date(year, month - 1, day + 1)
        year = nextDay.getFullYear()
        month = nextDay.getMonth() + 1
        day = nextDay.getDate()
    }
    return {
        year: year,
        month: month,
        day: day,
        type: type,
    }
}

export interface Menu {
    allergicInfo?: AllergicInfo[]
    name: string
}

export interface Origin {
    name: string
    origin: string
}

export interface Energy {
    name: string
    value: number
    unit: string
}

export interface MealResponse extends commonApi {
    data: {
        time: mealTime
        menu: Menu[]
        image?: string
        vote?: {
            score: number
            me: number
            count: number
        }
        kcal?: number
        origin?: Origin[]
        energy?: Energy[]
    }
}

export function mealTimeToString(target: mealTime) {
    return `${target.year}_${target.month}_${target.day}_${target.type}`
}
