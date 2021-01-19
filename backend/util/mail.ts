import * as AWS from 'aws-sdk'

export function getMailHTML(title: string, preview: string, body: string) {
    return {
        html: `
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <title>${title}</title>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type">
                <meta content="width=device-width, initial-scale=1" name="viewport">
                <meta content="IE=edge" http-equiv="X-UA-Compatible">
                <style type="text/css">
                    body, table, td, a {
                        -webkit-text-size-adjust: 100%;
                        -ms-text-size-adjust: 100%;
                    }
            
                    table, td {
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                    }
            
                    img {
                        -ms-interpolation-mode: bicubic;
                    }
            
                    img {
                        border: 0;
                        height: auto;
                        line-height: 100%;
                        outline: none;
                        text-decoration: none;
                    }
            
                    table {
                        border-collapse: collapse !important;
                    }
            
                    body {
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                    }
            
                    a[x-apple-data-detectors] {
                        color: inherit !important;
                        text-decoration: none !important;
                        font-size: inherit !important;
                        font-family: inherit !important;
                        font-weight: inherit !important;
                        line-height: inherit !important;
                    }
            
                    a {
                        color: #00bc87;
                        text-decoration: underline;
                    }
            
                    * img[tabindex='0'] + div {
                        display: none !important;
                    }
            
                    @media screen and (max-width: 350px) {
                        h1 {
                            font-size: 24px !important;
                            line-height: 24px !important;
                        }
                    }
            
                    @media screen and (min-width: 360px) {
                        .headingMobile {
                            font-size: 40px !important;
                        }
            
                        .headingMobileSmall {
                            font-size: 28px !important;
                        }
                    }
                </style>
            </head>
            <body bgcolor="#ffffff" style="background-color: #ffffff; margin: 0 !important; padding: 0 !important;">
            <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                 ${preview}
            </div>
            <center>
                <table align="center" border="0" cellpadding="0" cellspacing="0" valign="top" width="100%">
                    <tbody>
                    <tr>
                        <td>
                            <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" style="padding: 0 20px !important;max-width: 500px;width: 90%;"
                                   valign="top">
                                <tbody>
                                <tr>
                                    <td align="center" bgcolor="#ffffff" style="padding: 10px 0 0px 0;"><!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="350">
                                            <tr>
                                                <td align="center" valign="top" width="350">
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" style="max-width: 500px;border-bottom: 1px solid #e4e4e4 ;"
                                               width="100%">
                                            <tbody>
                                            <tr>
                                                <td align="left" bgcolor="#ffffff" style="padding: 0px; color: #111111; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; line-height: 62px;padding:0 0 15px 0;"
                                                    valign="middle">
                                                    <a href="https://iasa.kr" target="_blank"><img alt="logo" height="50" src="https://s3.ap-northeast-2.amazonaws.com/public.iasa.kr/logo.jpg"
                                                                                                   width="45"></a>
                                                </td>
                                                <td align="right" bgcolor="#ffffff" style="padding: 0px; color: #111111; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; line-height: 48px;padding:0 0 15px 0;"
                                                    valign="middle">
                                                    <a href="https://iasa.kr/" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;color: #797979;font-size: 12px;font-weight:400;-webkit-font-smoothing:antialiased;text-decoration: none;"
                                                       target="_blank">IASA
                                                        Portal</a></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]></td></tr></table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" bgcolor="#ffffff" style="padding: 0;"><!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="350">
                                            <tr>
                                                <td align="center" valign="top" width="350">
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" style="max-width: 500px;border-bottom: 1px solid #e4e4e4;"
                                               width="100%">
                                            <tbody>
                                            <tr>
                                                <td align="left" bgcolor="#ffffff"
                                                    style="padding: 20px 0 0 0; color: #666666; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400;-webkit-font-smoothing:antialiased;">
                                                    <p class="headingMobile"
                                                       style="margin: 0;color: #171717;font-size: 26px;font-weight: 200;line-height: 130%;margin-bottom:5px;">
                                                        IASA Portal 계정 인증</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td height="20"></td>
                                            </tr>
                                            ${body}
                                            </tbody>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" bgcolor="#ffffff" style="padding: 0;"><!--[if (gte mso 9)|(IE)]>
                                        <table align="center" border="0" cellspacing="0" cellpadding="0" width="350">
                                            <tr>
                                                <td align="center" valign="top" width="150">
                                        <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" style="max-width: 500px;" width="100%">
                                            <tbody>
                                            <tr>
                                                <td align="center" bgcolor="#ffffff"
                                                    style="padding: 10px 0 10px 0; color: #666666; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 18px;">
                                            <tr>
                                                <td align="center" bgcolor="#ffffff"
                                                    style="padding: 0; color: #666666; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 18px;">
                                                    <p style="margin: 0;color: #585858;font-size: 12px;font-weight: 400;-webkit-font-smoothing:antialiased;line-height: 170%;"></p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" bgcolor="#ffffff"
                                                    style="padding: 15px 0 30px 0; color: #666666; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 18px;">
                                                    <p style="margin: 0;color: #585858;font-size: 12px;font-weight: 400;-webkit-font-smoothing:antialiased;line-height: 170%;">
                                                        2019-2021 NULL®<br> 인천과학예술영재학교<br> 인천광역시 연수구 아카데미로 192</p>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <!--[if (gte mso 9)|(IE)]></td></tr></table>
                                        <![endif]-->
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </center>
            </body>
            </html>`,
        text: preview,
        subject: title,
    }
}

export function getVerificationMailHTML(verificationLink: string) {
    return getMailHTML(
        '인증하기 - IASA PORTAL',
        '링크를 클릭해서 회원가입을 완료하세요. 링크는 1시간 동안만 유효합니다',
        `
        <tr>
            <td align="left" bgcolor="#ffffff"
                style="padding:0; color: #666666; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400;-webkit-font-smoothing:antialiased;">
                <p style="margin:0;color:#585858;font-size:14px;font-weight:400;line-height:170%;">
                    IASA Portal에 오신 것을 진심으로 환영합니다!</p>
                <p style="margin:0;margin-top:20px;line-height:0;"></p>
                <p style="margin:0;color:#585858;font-size:14px;font-weight:400;line-height:170%;">
                    아래의 버튼을 눌러서 회원가입을 마치세요.</p>
                <p style="margin:0;margin-top:20px;line-height:0;"></p>
                <p style="margin:0;color:#585858;font-size:14px;font-weight:400;line-height:170%;">
                    링크는 1시간 동안만 유효합니다.</p>
            </td>
        </tr>
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="padding: 33px 0 33px 0;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" bgcolor="#00bc87"
                                        style="border-radius: 4px;"><a href="${verificationLink}"
                                                                       style="text-transform:uppercase;background:#5351db;font-size: 13px; font-weight: 700; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none !important; padding: 20px 25px; border-radius: 4px; border: 1px solid #5351db; display: block;-webkit-font-smoothing:antialiased;"><span
                                            style="color: #ffffff;text-decoration: none;"
                                            target="_blank">인증하기</span></a></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr> 
    `
    )
}

export async function sendMail(
    data: { html: string; text: string; subject: string },
    from: string,
    to: string
) {
    AWS.config.update({ region: 'us-east-1' })

    const params = {
        Destination: {
            ToAddresses: [to],
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: data.html,
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: data.text,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: data.subject,
            },
        },
        Source: `${from}@iasa.kr`,
        ReplyToAddresses: [to],
    }

    try {
        await new AWS.SES({ apiVersion: '2010-12-01' })
            .sendEmail(params)
            .promise()
        return true
    } catch (e) {
        return false
    }
}
