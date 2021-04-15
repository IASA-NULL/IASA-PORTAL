/*
2021 SeoRii®. All right reserved.

createResponse.ts
백엔드 요청 반환용 양식!
 */

export default function createResponse(body: any, message = '') {
    if (body === false)
        return {
            success: false,
            message: message,
            data: {},
        }
    // body가 false가 아닐 경우 data에 넣기
    return {
        success: true,
        message: message,
        data: body,
    }
}
