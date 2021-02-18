import * as React from 'react'
import { withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Icon } from '@rmwc/icon'
import { Typography } from '@rmwc/typography'
import { BrIfMobile, focusNextInput, SearchUser } from '../util'
import { Grid, GridCell, GridRow } from '@rmwc/grid'
import { Permission, token } from '../../scheme/api/auth'
import { TextField } from '@rmwc/textfield'
import { PenaltyResponse } from '../../scheme/api/penalty'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import { CardMedia } from '@rmwc/card'
import { CircularProgress } from '@rmwc/circular-progress'
import {
    Dialog,
    DialogActions,
    DialogButton,
    DialogContent,
    DialogTitle,
} from '@rmwc/dialog'
import { Ripple } from '@rmwc/ripple'

interface ShareProps {}

interface ShareState {
    code: string
    detailOpened: boolean
    data?: PenaltyResponse
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

    public upload() {
        this.setState({ uploaded: false, detailOpened: true })
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
                            width: 'calc(100% - 46px)',
                            height: '300px',
                            margin: '23px',
                            borderRadius: '3px',
                            border: 'solid 1px #888',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            this.fileInput.current.click()
                        }}
                        onDragOver={(e) => {
                            e.preventDefault()
                        }}
                        onDrop={(e) => {
                            console.log('File(s) dropped')

                            e.preventDefault()

                            const files = e.dataTransfer.items
                            for (let file of files) {
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
                            }
                            this.upload()

                            for (
                                var i = 0;
                                i < e.dataTransfer.items.length;
                                i++
                            ) {
                                // If dropped items aren't files, reject them
                                if (e.dataTransfer.items[i].kind === 'file') {
                                    var file = e.dataTransfer.items[
                                        i
                                    ].getAsFile()
                                    console.log(
                                        '... file[' +
                                            i +
                                            '].name = ' +
                                            file.name
                                    )
                                }
                            }
                        }}>
                        <Icon
                            icon='cloud_upload'
                            style={{ fontSize: '60px' }}
                        />
                        <br />
                        <Typography use='headline4'>
                            여기를 클릭하거나 파일을 끌어다 놓으세요!
                        </Typography>
                    </div>
                </Ripple>
                <input
                    type='file'
                    multiple
                    style={{ display: 'none' }}
                    ref={this.fileInput}
                />
                <br />
                <br />
                <Typography use='headline5'>다운로드</Typography>
                <BrIfMobile />
                <Typography use='subtitle2' style={{ marginLeft: '10px' }}>
                    코드를 입력해서 파일을 다운받아요.
                </Typography>
                <br />
                <Grid>
                    <GridRow>
                        <GridCell desktop={8} tablet={8} phone={4}>
                            <TextField
                                style={{ width: '100%', height: '100%' }}
                                outlined
                                label='코드'
                                value={this.state?.code}
                                onChange={(e) => this.handleChange(e, 'code')}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') focusNextInput()
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
                                label='조회'
                                trailingIcon='send'
                                onClick={() => {
                                    setTimeout(() => {}, 0)
                                }}
                            />
                        </GridCell>
                    </GridRow>
                </Grid>

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
                        {this.state?.uploaded
                            ? `코드는 0000 이에요.`
                            : '잠시만 기다리세요.'}
                    </DialogContent>
                    <DialogActions>
                        <DialogButton action='close'>닫기</DialogButton>
                    </DialogActions>
                </Dialog>
                <SnackbarQueue messages={this.messages} />
            </>
        )
    }
}

export default Share
