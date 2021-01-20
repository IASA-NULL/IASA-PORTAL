import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Button } from '@rmwc/button'
import { Typography } from '@rmwc/typography'
import { Select } from '@rmwc/select'

import { BrIfMobile, FileInput, focusNextInput } from '../util'
import { createSnackbarQueue, SnackbarQueue } from '@rmwc/snackbar'
import createURL from '../../scheme/url'
import { Grid, GridCell, GridRow } from '@rmwc/grid'
import { TextField } from '@rmwc/textfield'

interface IState {
    selectedType: string
}

class CreateCode extends React.Component<any, IState> {
    messages: any
    notify: any
    fileList: FileList

    constructor(props: RouteComponentProps) {
        super(props)
        let qu = createSnackbarQueue()
        this.messages = qu.messages
        this.notify = qu.notify
    }

    public create() {
        const data = new FormData()

        for (const file of this.fileList) {
            data.append('files[]', file, file.name)
        }

        fetch(createURL('api', 'files', 'upload'), {
            method: 'POST',
            body: data,
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    console.log(res.data)
                }
            })
    }

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({ [target]: e.target.value })
    }

    public render() {
        return (
            <>
                <Typography use='headline3'>가입 코드 발급</Typography>
                <BrIfMobile />
                <Typography use='subtitle1' style={{ marginLeft: '10px' }}>
                    사용자가 가입할 수 있도록 코드를 발급해요.
                </Typography>
                <br />
                <br />
                <br />
                <Grid>
                    <GridRow>
                        <GridCell desktop={4} tablet={4} phone={4}>
                            <Select
                                label='종류 선택'
                                outlined
                                enhanced
                                options={[
                                    {
                                        label: '1학년',
                                        value: 'S1',
                                    },
                                    {
                                        label: '2학년',
                                        value: 'S2',
                                    },
                                    {
                                        label: '3학년',
                                        value: 'S3',
                                    },
                                    {
                                        label: '선생님',
                                        value: 'T0',
                                    },
                                ]}
                                onChange={(e) =>
                                    this.setState({
                                        selectedType: e.currentTarget.value,
                                    })
                                }
                            />
                        </GridCell>
                        <GridCell desktop={3} tablet={4} phone={4}>
                            <TextField
                                style={{ width: '100%', height: '100%' }}
                                outlined
                                label='학생 이름'
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') focusNextInput()
                                }}
                            />
                        </GridCell>
                        <GridCell desktop={3} tablet={4} phone={4}>
                            <FileInput
                                style={{ width: '100%', height: '100%' }}
                                outlined
                                label='학생 사진'
                                accept='image/*'
                                onKeyDown={(e: KeyboardEvent) => {
                                    if (e.key === 'Enter') focusNextInput()
                                }}
                                onFileSelect={(files: FileList) => {
                                    this.fileList = files
                                }}
                            />
                        </GridCell>

                        <GridCell desktop={2} tablet={8} phone={4}>
                            <Button
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    minHeight: '45.2px',
                                }}
                                outlined
                                label='발급'
                                trailingIcon='send'
                                onClick={this.create.bind(this)}
                            />
                        </GridCell>
                    </GridRow>
                </Grid>
                <br />
                <SnackbarQueue messages={this.messages} />
            </>
        )
    }
}

export default withRouter(CreateCode)
