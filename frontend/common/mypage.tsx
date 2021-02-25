import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import {
    BrIfMobile,
    fetchAPI,
    FileInput,
    focusNextInput,
    RequireSudo,
} from '../util'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import createURL from '../../scheme/url'

interface IProps {}

interface IState {
    edit: boolean
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
                this.state = { edit: true }
            }
        } catch (e) {}
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

    public save() {
        const data = new FormData()

        for (const file of this.fileList) {
            data.append('files[]', file, file.name)
        }

        const searchParams = new URLSearchParams(window.location.search)
        searchParams.set('edit', '')
        window.history.replaceState(null, null, window.location.pathname)
        this.setState({ edit: false })
        fetch(createURL('api', 'files', 'upload'), {
            method: 'POST',
            body: data,
        })
            .then((res) => res.json())
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
                            label='사진'
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
                    </>
                ) : (
                    <></>
                )}
                <Button
                    onClick={() => {
                        if (this.state?.edit) this.save()
                        else this.enableEdit()
                    }}
                    outlined
                    style={{ marginLeft: '20px' }}>
                    {this.state?.edit ? '저장' : '수정하기'}
                </Button>
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
