import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { Radio } from '@rmwc/radio'
import {
    BrIfMobile,
    fetchAPI,
    FileInput,
    focusNextInput,
    RequireSudo,
    uploadFile,
    UserImage,
} from '../util'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import createURL from '../../scheme/url'

declare const DEV_MODE: boolean

interface IProps {}

interface IState {
    edit: boolean
    theme?: string
    avatarBlob?: string
}

class MyPage extends React.Component<any, IState> {
    messages: any
    notify: any
    fileList: FileList

    constructor(props: IProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify

        const searchParams = new URLSearchParams(window.location.search)
        try {
            const edit = searchParams.get('edit')
            if (edit) {
                RequireSudo()
                this.state = { edit: true, theme: localStorage.theme }
            } else this.state = { edit: false, theme: localStorage.theme }
        } catch (e) {
            this.state = { edit: false, theme: localStorage.theme }
        }

        fetch(createURL('api', 'account', 'avatar'), {
            method: 'GET',
            ...(!DEV_MODE && { credentials: 'include' }),
            headers: {
                'Content-Type': 'application/json',
                verify: window.localStorage.tokenId,
            },
        })
            .then((res) => res.blob())
            .then((res) =>
                this.setState({ avatarBlob: URL.createObjectURL(res) })
            )
    }

    public enableEdit() {
        const searchParams = new URLSearchParams(window.location.search)
        searchParams.set('edit', 'true')
        window.history.replaceState(
            null,
            null,
            window.location.pathname + '?' + searchParams.toString()
        )
        this.setState({ edit: true })
        RequireSudo()
    }

    public discard() {
        const searchParams = new URLSearchParams(window.location.search)
        searchParams.set('edit', '')
        window.history.replaceState(
            null,
            null,
            window.location.pathname + '?' + searchParams.toString()
        )
        this.setState({ edit: false })
    }

    public save() {
        const data = new FormData()

        for (const file of this.fileList) {
            data.append('files[]', file, file.name)
        }

        const searchParams = new URLSearchParams(window.location.search)
        searchParams.set('edit', '')
        window.history.replaceState(null, null, window.location.pathname)
        this.setState({ edit: false })
        uploadFile(data)
            .then((res) => {
                if (res.success) {
                    fetchAPI(
                        'PUT',
                        {
                            avatar: res.data.fileList[0],
                        },
                        'account',
                        'edit'
                    )
                        .then((res) => {
                            if (res.success) {
                                this.notify({
                                    title: <b>성공!</b>,
                                    body: '정보를 성공적으로 수정했어요.',
                                    icon: 'check',
                                    dismissIcon: true,
                                })
                                setTimeout(() => {
                                    window.location.reload()
                                }, 1000)
                            } else
                                this.notify({
                                    title: <b>오류</b>,
                                    body: res.message,
                                    icon: 'error_outline',
                                    dismissIcon: true,
                                })
                        })
                        .catch(() => {
                            this.notify({
                                title: <b>오류</b>,
                                body: '서버와 연결할 수 없어요.',
                                icon: 'error_outline',
                                dismissIcon: true,
                            })
                        })
                }
            })
            .catch(() => {
                this.notify({
                    title: <b>오류</b>,
                    body: '서버와 연결할 수 없어요.',
                    icon: 'error_outline',
                    dismissIcon: true,
                })
            })
    }

    public setTheme(target: string) {
        window.localStorage.theme = target
        this.setState({ theme: target })
        window.dispatchEvent(new Event('updateTheme'))
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>마이페이지</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    내 정보를 보거나 수정할 수 있어요.
                </Typography>
                <br />
                <br />
                {this.state?.edit ? (
                    <>
                        <FileInput
                            style={{ width: '100%', height: '100%' }}
                            outlined
                            label='계정 사진'
                            accept='image/*'
                            onKeyDown={(e: KeyboardEvent) => {
                                if (e.key === 'Enter') focusNextInput()
                            }}
                            onFileSelect={(files: FileList) => {
                                this.fileList = files
                            }}
                        />
                        <br />
                        <br />
                        <Button
                            onClick={() => {
                                this.save()
                            }}
                            outlined
                            style={{ marginLeft: '20px' }}>
                            저장
                        </Button>
                        <Button
                            onClick={() => {
                                this.discard()
                            }}
                            outlined
                            style={{ marginLeft: '10px' }}>
                            취소
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography use='headline5'>계정 사진</Typography>
                        <br />
                        <br />
                        <UserImage url={this.state?.avatarBlob} size={50} />
                        <br />
                        <br />
                        <Typography use='headline5'>테마 설정</Typography>
                        <br />
                        <br />
                        <>
                            <Radio
                                value='시스템 설정'
                                checked={
                                    this.state.theme !== '1' &&
                                    this.state.theme !== '2'
                                }
                                onChange={() => {
                                    this.setTheme('0')
                                }}>
                                시스템 설정
                            </Radio>
                            <Radio
                                value='라이트'
                                checked={this.state.theme === '1'}
                                onChange={() => {
                                    this.setTheme('1')
                                }}>
                                라이트
                            </Radio>

                            <Radio
                                value='다크'
                                checked={this.state.theme === '2'}
                                onChange={() => {
                                    this.setTheme('2')
                                }}>
                                다크
                            </Radio>
                            <br />
                            <br />
                            <Button
                                onClick={() => {
                                    this.enableEdit()
                                }}
                                outlined
                                style={{ marginLeft: '20px' }}>
                                수정하기
                            </Button>
                        </>
                    </>
                )}
                <Button
                    onClick={() => {
                        window.location.href = createURL(
                            'api',
                            'account',
                            'reqchangesecret'
                        )
                    }}
                    outlined
                    style={{ marginLeft: '10px' }}>
                    비밀번호 변경하기
                </Button>
                <SnackbarQueue messages={this.messages} />
            </>
        )
    }
}

export default withRouter(MyPage)
