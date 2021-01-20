import * as React from 'react'
import { TextField } from '@rmwc/textfield'
import { Button } from '@rmwc/button'
import { Icon } from '@rmwc/icon'

import Inko from 'inko'

import { focusNextInput, getCaretPosition, setCaretPosition } from '../util'

interface SignupCodeFormProps {
    setState: any
    isMobile: boolean
    context: any
    next: any
}

interface SignupCodeFormState {
    code: string
    showSignupMenu: boolean
}

interface SignupFillFormProps {
    setState: any
    isMobile: boolean
    context: any
    next?: any
}

interface SignupFillFormState {
    id: string
    password: string
    passwordConfirm: string
    email: string
    showSignupMenu: boolean
}

interface SignupFinFormProps {
    isMobile: boolean
    next?: any
}

export class SignupCode extends React.Component<
    SignupCodeFormProps,
    SignupCodeFormState
> {
    firstInput: any

    public componentDidMount() {
        window.addEventListener('loginStateUpdate', () => {
            this.forceUpdate()
        })
        window.addEventListener('focusFrame', (e: CustomEvent) => {
            if (e.detail.frame === 'SignupCode') this.firstInput.focus()
        })
    }

    public handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let pos = getCaretPosition(e.target)
        let code = e.target.value
        let inko = new Inko()
        code = inko.ko2en(code).toUpperCase()
        code = code.replace(/[^A-Z0-9]/g, '')
        code = code.substr(0, 24)
        this.props.context.set('signupCode', code)
        let formattedCode = ''
        while (code.length > 4) {
            formattedCode += code.substr(0, 4)
            code = code.substr(4)
            formattedCode += ' - '
        }
        formattedCode += code
        this.setState({ code: formattedCode })
        if (pos % 7 === 5) pos += 3
        if (pos % 7 === 0 && pos > 0) pos -= 3
        setCaretPosition(e.target, pos)
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
                    style={{ width: '100%' }}
                    outlined
                    label='코드'
                    disabled={!this.props.context.get('loaded')}
                    value={this.state?.code}
                    onChange={this.handleChange.bind(this)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') this.props.next()
                    }}
                    invalid={!!errS}
                    ref={(input) => {
                        this.firstInput = input
                    }}
                />
                <br />
                {errMessage}
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
                        다음
                    </Button>
                </div>
            </div>
        )
    }
}

export class SignupFill1 extends React.Component<
    SignupFillFormProps,
    SignupFillFormState
> {
    firstInput: any

    constructor(props: SignupFillFormProps) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    public componentDidMount() {
        window.addEventListener('loginStateUpdate', () => {
            this.forceUpdate()
        })
        window.addEventListener('focusFrame', (e: CustomEvent) => {
            if (e.detail.frame === 'SignupFill1') this.firstInput.focus()
        })
    }

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({ [target]: e.target.value })
        // @ts-ignore
        this.props.context.set('signup_' + target, e.target.value)
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
                <div style={{ width: '100%', height: '20px' }} />
                <TextField
                    style={{ width: '100%', height: '100%' }}
                    outlined
                    value={this.state?.id}
                    onChange={(e) => this.handleChange(e, 'id')}
                    label='아이디'
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
                    value={this.state?.email}
                    onChange={(e) => this.handleChange(e, 'email')}
                    label='이메일'
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
                        다음
                    </Button>
                </div>
            </div>
        )
    }
}

export class SignupFill2 extends React.Component<
    SignupFillFormProps,
    SignupFillFormState
> {
    firstInput: any

    constructor(props: SignupFillFormProps) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    public componentDidMount() {
        window.addEventListener('loginStateUpdate', () => {
            this.forceUpdate()
        })
        window.addEventListener('focusFrame', (e: CustomEvent) => {
            if (e.detail.frame === 'SignupFill2') this.firstInput.focus()
        })
    }

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({ [target]: e.target.value })
        // @ts-ignore
        this.props.context.set('signup_' + target, e.target.value)
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
                        다음
                    </Button>
                </div>
            </div>
        )
    }
}

export class SignupFin extends React.Component<SignupFinFormProps, null> {
    public componentDidMount() {
        window.addEventListener('loginStateUpdate', () => {
            this.forceUpdate()
        })
    }

    public render() {
        return (
            <div
                style={{
                    width: this.props.isMobile ? 'calc(100vw - 60px)' : '380px',
                    padding: `5px ${this.props.isMobile ? 30 : 60}px`,
                    float: 'left',
                }}>
                <div
                    style={{
                        clear: 'both',
                        marginTop: '20px',
                        marginBottom: '20px',
                    }}>
                    <Button
                        style={{ float: 'right' }}
                        raised
                        onClick={this.props.next}>
                        다음
                    </Button>
                </div>
            </div>
        )
    }
}
