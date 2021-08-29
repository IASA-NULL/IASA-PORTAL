import * as React from 'react'

import { Button } from '@rmwc/button'
import { Icon } from '@rmwc/icon'
import { Typography } from '@rmwc/typography'
import { BrIfMobile, fetchAPI, focusNextInput, uploadFile } from '../util'
import { Grid, GridCell, GridRow } from '@rmwc/grid'
import { TextField } from '@rmwc/textfield'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import {
    Dialog,
    DialogActions,
    DialogButton,
    DialogContent,
    DialogTitle,
} from '@rmwc/dialog'
import { Ripple } from '@rmwc/ripple'
import createURL from '../../scheme/url'

interface ShareProps {
    hideDownload?: boolean
}

interface ShareState {
    code: string
    detailOpened: boolean
    data?: any
    uploaded: boolean
}

class Share extends React.Component<ShareProps, ShareState> {
    messages: any
    notify: any
    fileInput = React.createRef() as React.RefObject<HTMLInputElement>

    constructor(props: ShareProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify

        this.handleChange = this.handleChange.bind(this)
    }

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({ [target]: e.target.value })
    }

    public upload(files: File[]) {
        if (!files.length) return
        this.setState({ uploaded: false, detailOpened: true })

        const data = new FormData()

        for (const file of files) {
            data.append('files[]', file, file.name)
        }

        uploadFile(data).then((res) => {
            if (res.success) {
                fetchAPI(
                    'POST',
                    {
                        files: res.data.fileList,
                    },
                    'share',
                    'upload'
                )
                    .then((res) => {
                        if (res.success) {
                            this.setState({
                                uploaded: true,
                                data: res.data,
                            })
                        } else {
                            this.notify({
                                title: <b>오류</b>,
                                body: res.message,
                                icon: 'error_outline',
                                dismissIcon: true,
                            })
                            this.setState({
                                detailOpened: false,
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
                        this.setState({
                            detailOpened: false,
                        })
                    })
            }
        })
    }

    public download() {
        fetchAPI('GET', {}, 'share', this.state.code)
            .then((res) => {
                if (res.success) {
                    this.setState({ code: '' })
                    const download_next = (i: number) => {
                        if (i >= res.data.length) {
                            return
                        }
                        const a = document.createElement('a')
                        a.href =
                            createURL('api', 'files', 'download', res.data[i]) +
                            '?verify=' +
                            window.localStorage.tokenId
                        a.target = '_parent'
                        ;(
                            document.body || document.documentElement
                        ).appendChild(a)
                        a.click()
                        a.parentNode.removeChild(a)
                        setTimeout(function () {
                            download_next(i + 1)
                        }, 500)
                    }
                    download_next(0)
                } else {
                    this.notify({
                        title: <b>오류</b>,
                        body: res.message,
                        icon: 'error_outline',
                        dismissIcon: true,
                    })
                    this.setState({
                        detailOpened: false,
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
                this.setState({
                    detailOpened: false,
                })
            })
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>빠른 공유</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    파일을 교내 시스템 내에 빠르게 공유할 수 있어요!
                </Typography>
                <br />
                <br />
                <Typography use='headline5'>업로드</Typography>
                <BrIfMobile />
                <Typography use='subtitle2' style={{ marginLeft: '10px' }}>
                    파일을 업로드해서 코드를 생성해요.
                </Typography>
                <br />
                <Ripple>
                    <div
                        style={{
                            width: 'calc(100% - 66px)',
                            height: '300px',
                            margin: '23px',
                            borderRadius: '3px',
                            border: 'solid 1px #888',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '10px',
                        }}
                        onClick={() => {
                            this.fileInput.current.click()
                        }}
                        onDragOver={(e) => {
                            e.preventDefault()
                        }}
                        onDrop={(e) => {
                            e.preventDefault()

                            let files = []

                            for (let file of e.dataTransfer.items) {
                                if (file.webkitGetAsEntry().isDirectory) {
                                    this.notify({
                                        title: <b>오류</b>,
                                        body:
                                            '아직 폴더는 업로드 할 수 없어요!',
                                        icon: 'error_outline',
                                        dismissIcon: true,
                                    })
                                    return
                                }
                                files.push(file.getAsFile())
                            }

                            this.upload(files)
                        }}>
                        <Icon
                            icon='cloud_upload'
                            style={{ fontSize: '60px' }}
                        />
                        <br />
                        <Typography
                            use='headline4'
                            style={{ textAlign: 'center' }}>
                            여기를 클릭하거나 파일을 끌어다 놓으세요!
                        </Typography>
                    </div>
                </Ripple>
                <input
                    type='file'
                    multiple
                    style={{ display: 'none' }}
                    ref={this.fileInput}
                    onChange={(e) => {
                        if (e.currentTarget.files)
                            this.upload(Array.from(e.currentTarget.files))
                    }}
                />
                {!this.props.hideDownload ? (
                    <>
                        <br />
                        <br />
                        <Typography use='headline5'>다운로드</Typography>
                        <BrIfMobile />
                        <Typography
                            use='subtitle2'
                            style={{ marginLeft: '10px' }}>
                            코드를 입력해서 파일을 다운받아요.
                        </Typography>
                        <br />
                        <Grid>
                            <GridRow>
                                <GridCell desktop={8} tablet={8} phone={4}>
                                    <TextField
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        outlined
                                        label='코드'
                                        value={this.state?.code}
                                        onChange={(e) =>
                                            this.handleChange(e, 'code')
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter')
                                                focusNextInput()
                                        }}
                                    />
                                </GridCell>
                                <GridCell desktop={4} tablet={8} phone={4}>
                                    <Button
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            minHeight: '45.2px',
                                        }}
                                        outlined
                                        label='다운로드'
                                        trailingIcon='send'
                                        onClick={() => {
                                            setTimeout(() => {
                                                this.download()
                                            }, 0)
                                        }}
                                    />
                                </GridCell>
                            </GridRow>
                        </Grid>
                    </>
                ) : (
                    <Typography use='headline5'>
                        다운로드 기능을 사용하려면 로그인하세요.
                    </Typography>
                )}
                <Dialog
                    preventOutsideDismiss
                    open={this.state?.detailOpened}
                    onClose={() => {
                        this.setState({ detailOpened: false })
                    }}>
                    <DialogTitle>
                        {this.state?.uploaded
                            ? '코드가 생성됐어요!'
                            : '파일을 업로드하고 있어요.'}
                    </DialogTitle>
                    <DialogContent>
                        {this.state?.uploaded ? (
                            <Typography use='headline2'>
                                {this.state?.data?.code}
                            </Typography>
                        ) : (
                            '잠시만 기다리세요.'
                        )}
                    </DialogContent>
                    <DialogActions>
                        <DialogButton
                            action='close'
                            disabled={!this.state?.uploaded}>
                            닫기
                        </DialogButton>
                    </DialogActions>
                </Dialog>
                <SnackbarQueue messages={this.messages} />
            </>
        )
    }
}

export default Share
