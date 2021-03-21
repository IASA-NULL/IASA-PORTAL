import iconvLite from 'iconv-lite'

export function getDownloadFilename(filename: string, req: any) {
    const header = req.headers['user-agent']

    if (header.includes('MSIE') || header.includes('Trident'))
        return encodeURIComponent(filename).replace(/\\+/gi, '%20')

    return iconvLite.decode(iconvLite.encode(filename, 'UTF-8'), 'ISO-8859-1')
}
