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
import createURL from '../../scheme/url'
import getBlobDuration from 'get-blob-duration'

declare const DEV_MODE: boolean

interface MediaDevices extends EventTarget {
    ondevicechange: ((this: MediaDevices, ev: Event) => any) | null

    enumerateDevices(): Promise<MediaDeviceInfo[]>

    getSupportedConstraints(): MediaTrackSupportedConstraints

    getUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>

    addEventListener<K extends keyof MediaDevicesEventMap>(
        type: K,
        listener: (this: MediaDevices, ev: MediaDevicesEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void

    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ): void

    removeEventListener<K extends keyof MediaDevicesEventMap>(
        type: K,
        listener: (this: MediaDevices, ev: MediaDevicesEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void

    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions
    ): void
}

interface RecordProps {
    hideDownload?: boolean
}

interface RecordState {
    recording: boolean
    recordEnd: boolean
    code: string
    icode: string
}

const finRecord = new Event('finRecord')
let chunks: any[] = [],
    rid = '',
    iid: NodeJS.Timeout

async function upload() {
    while (chunks.length) {
        const data = new FormData()

        const duration = await getBlobDuration(chunks[0][0])
        data.append('files[]', chunks[0][0], 'record')

        await uploadFile(data).then(async (res) => {
            await fetchAPI(
                'POST',
                {
                    rid,
                    vid: res.data.fileList[0],
                    time: chunks[0][1],
                    duration,
                },
                'record'
            ).then((res) => {
                chunks.shift()
            })
        })
    }
}

function initRecord(stream: any) {
    ;(async () => {
        //@ts-ignore
        let rec = new MediaRecorder(stream, {
            mimeType: 'video/webm; codecs=vp9',
        })
        iid = setInterval(() => {
            try {
                rec.stop()
                //@ts-ignore
                rec = new MediaRecorder(stream, {
                    mimeType: 'video/webm; codecs=vp9',
                })
                rec.onstop = upload
                rec.ondataavailable = (e: any) =>
                    chunks.push([e.data, Date.now()])
                rec.start()
            } catch (e) {
                clearInterval(iid)
                window.dispatchEvent(finRecord)
            }
        }, 3000)
        rec.ondataavailable = (e: any) => chunks.push([e.data, Date.now()])
        rec.onstop = upload
        rec.start()
    })()
}

function handleSourceOpen(
    mediaSource: any,
    lists: any[],
    duration: number,
    video: HTMLVideoElement
) {
    let sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs=vp9')
    sourceBuffer.mode = 'sequence'
    mediaSource.duration = duration - 0.1
    fetchSegmentAndAppend(lists.shift(), sourceBuffer, function () {
        function iter() {
            let url = lists.shift()

            if (url === undefined) {
                return
            }
            fetchSegmentAndAppend(url, sourceBuffer, (err: any) => {
                if (err) {
                    console.error(err)
                } else {
                    setTimeout(iter, 200)
                }
            })
        }

        iter()
        setTimeout(() => {
            video.play()
        }, 300)
    })
}

function fetchSegmentAndAppend(
    segmentUrl: string,
    sourceBuffer: any,
    callback: any
) {
    fetchArrayBuffer(segmentUrl, function (buf: any) {
        sourceBuffer.addEventListener('updateend', function () {
            callback()
        })
        sourceBuffer.addEventListener('error', function (ev: any) {
            callback(ev)
        })
        sourceBuffer.appendBuffer(buf)
    })
}

function fetchArrayBuffer(url: string, callback: any) {
    fetch(url, {
        method: 'GET',
        ...(!DEV_MODE && { credentials: 'include' }),
        headers: {
            'Content-Type': 'application/json',
            verify: window.localStorage.tokenId,
        },
    })
        .then((res) => res.arrayBuffer())
        .then((res) => callback(res))
}

class Record extends React.Component<RecordProps, RecordState> {
    messages: any
    notify: any
    fileInput = React.createRef() as React.RefObject<HTMLInputElement>
    videoRef = React.createRef() as React.RefObject<HTMLVideoElement>
    video2Ref = React.createRef() as React.RefObject<HTMLVideoElement>

    constructor(props: RecordProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify

        this.handleChange = this.handleChange.bind(this)
        this.beginRecord = this.beginRecord.bind(this)

        window.addEventListener('loginStateUpdate', () => {
            this.stopRecording()
        })
    }

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({ [target]: e.target.value })
    }

    public async beginRecord() {
        let captureStream = null

        fetchAPI('GET', {}, 'record')
            .then(async (res) => {
                if (res.success) {
                    rid = res.data.rid
                    try {
                        //@ts-ignore
                        captureStream = await navigator.mediaDevices.getDisplayMedia(
                            {
                                video: {
                                    cursor: 'always',
                                },
                                audio: false,
                            }
                        )
                        this.setState({ recording: true, code: res.data.code })
                        this.videoRef.current.srcObject = captureStream
                        initRecord(captureStream)
                        this.videoRef.current.play()
                    } catch (err) {
                        this.setState({ recording: false })
                    }
                } else {
                    this.notify({
                        title: <b>오류</b>,
                        body: res.message,
                        icon: 'error_outline',
                        dismissIcon: true,
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

    public stopRecording() {
        //@ts-ignore
        let tracks = this.videoRef.current.srcObject.getTracks()
        tracks.forEach((track: any) => track.stop())
        this.videoRef.current.srcObject = null
        this.setState({ recording: false, recordEnd: true })
    }

    public view() {
        fetchAPI('GET', {}, 'record', this.state?.icode)
            .then((res) => {
                if (res.success) {
                    let mediaSource = new MediaSource()
                    this.video2Ref.current.src = URL.createObjectURL(
                        mediaSource
                    )
                    mediaSource.addEventListener('sourceopen', () => {
                        handleSourceOpen(
                            mediaSource,
                            res.data.list,
                            res.data.duration,
                            this.video2Ref.current
                        )
                    })
                } else {
                    this.notify({
                        title: <b>오류</b>,
                        body: res.message,
                        icon: 'error_outline',
                        dismissIcon: true,
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
                <Typography use='headline3'>화면 녹화</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    화면을 녹화하고 제출할 수 있어요.
                </Typography>
                <br />
                <br />
                <Button onClick={this.beginRecord} outlined>
                    녹화하기
                </Button>
                <br />
                <br />
                <Typography use='headline5'>영상 확인</Typography>
                <BrIfMobile />
                <Typography use='subtitle2' style={{ marginLeft: '10px' }}>
                    코드를 입력해서 녹화된 영상을 확인해요.
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
                                value={this.state?.icode}
                                onChange={(e) => this.handleChange(e, 'icode')}
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
                                label='확인'
                                trailingIcon='send'
                                onClick={() => {
                                    setTimeout(() => {
                                        this.view()
                                    }, 0)
                                }}
                            />
                        </GridCell>
                    </GridRow>
                </Grid>
                <br />
                <video
                    ref={this.video2Ref}
                    style={{ width: '100%' }}
                    controls
                />
                <Dialog
                    preventOutsideDismiss
                    open={this.state?.recording}
                    onClose={() => {
                        this.stopRecording()
                    }}>
                    <DialogTitle>녹화 중.....</DialogTitle>
                    <DialogContent>
                        이 탭을 닫지 마세요!
                        <br />
                        <br />
                        <video ref={this.videoRef} style={{ width: '100%' }} />
                    </DialogContent>
                    <DialogActions>
                        <DialogButton action='close'>녹화 중지</DialogButton>
                    </DialogActions>
                </Dialog>
                <Dialog
                    preventOutsideDismiss
                    open={this.state?.recordEnd}
                    onClose={() => {
                        this.setState({ recordEnd: false })
                    }}>
                    <DialogTitle>녹화 완료!</DialogTitle>
                    <DialogContent>
                        공유 코드는
                        <Typography use='headline4'>
                            {this.state?.code}
                        </Typography>
                        이에요!
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

export default Record
