export function getDateStr(ts = Date.now()) {
    const date = new Date(ts),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        dateStr = `${year}_${month}_${day}`
    return dateStr
}
