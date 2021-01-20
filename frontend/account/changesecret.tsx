import * as React from 'react'
import { Icon } from '@rmwc/icon'
import { TextField } from '@rmwc/textfield'
import { focusNextInput } from '../util'
import { Button } from '@rmwc/button'

interface ChangeSecretProps {
    setState: any
    isMobile: boolean
    context: any
    next?: any
}

interface ChangeSecretState {
    password: string
    passwordConfirm: string
}

export default class ChangeSecret extends React.Component<
    ChangeSecretProps,
    ChangeSecretState
> {
    firstInput: any

    constructor(props: ChangeSecretProps) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    public componentDidMount() {
        window.addEventListener('loginStateUpdate', () => {
            this.forceUpdate()
        })
        window.addEventListener('focusFrame', (e: CustomEvent) => {
            if (e.detail.frame === 'ChangeSecret') this.firstInput.focus()
        })
    }

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({ [target]: e.target.value })
        // @ts-ignore
        this.props.context.set('changepass_' + target, e.target.value)
    }

    public render() {
        let errS = this.props.context.get('errMessage')
        let errMessage = errS ? (
            <>
                <div
                    style={{
                        color: '#ff5959',
                        clear: 'both',
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '20px',
                    }}>
                    <Icon icon={{ icon: 'error_outline', size: 'xsmall' }} />
                    <span style={{ padding: '3px' }}>{errS}</span>
                </div>
            </>
        ) : (
            <></>
        )
        return (
            <div
                style={{
                    width: this.props.isMobile ? 'calc(100vw - 60px)' : '380px',
                    padding: `5px ${this.props.isMobile ? 30 : 60}px`,
                    float: 'left',
                }}>
                <TextField
                    style={{ width: '100%', height: '100%' }}
                    outlined
                    value={this.state?.password}
                    onChange={(e) => this.handleChange(e, 'password')}
                    label='비밀번호'
                    type='password'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') focusNextInput()
                    }}
                    ref={(input) => {
                        this.firstInput = input
                    }}
                />
                <div style={{ width: '100%', height: '20px' }} />
                <TextField
                    style={{ width: '100%', height: '100%' }}
                    outlined
                    value={this.state?.passwordConfirm}
                    onChange={(e) => this.handleChange(e, 'passwordConfirm')}
                    label='비밀번호 확인'
                    type='password'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') this.props.next()
                    }}
                />
                {errMessage}
                <div style={{ width: '100%', height: '20px' }} />
                <div
                    style={{
                        clear: 'both',
                        marginTop: '20px',
                        marginBottom: '20px',
                    }}>
                    <Button
                        style={{ float: 'right' }}
                        raised
                        onClick={this.props.next}
                        disabled={!this.props.context.get('loaded')}>
                        설정
                    </Button>
                </div>
            </div>
        )
    }
}
