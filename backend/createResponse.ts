export default function createResponse(body: any, message = '') {
    if (body === false)
        return {
            success: false,
            message: message,
            data: {},
        }
    return {
        success: true,
        message: message,
        data: body,
    }
}
