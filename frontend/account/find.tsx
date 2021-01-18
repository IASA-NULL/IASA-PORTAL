import * as React from "react";
import {TextField} from "@rmwc/textfield";
import {Button} from "@rmwc/button";
import {Icon} from "@rmwc/icon";
import {focusNextInput} from "../util";

interface IProps {
    setState: any
    isMobile: boolean
    context: any
    next?: any
}

interface findIdState {
    email: string
    name: string
}

export class FindID extends React.Component<IProps, findIdState> {
    firstInput: any

    constructor(props: IProps) {
        super(props)
    }

    public componentDidMount() {
        window.addEventListener('loginStateUpdate', () => {
            this.forceUpdate()
        })
        window.addEventListener('focusFrame', (e: CustomEvent) => {
            if (e.detail.frame === 'FindID') this.firstInput.focus()
        })
    }

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({[target]: e.target.value})
        // @ts-ignore
        this.props.context.set('signup_' + target, e.target.value)
    }

    public render() {
        let errS = this.props.context.get('errMessage')
        let errMessage = errS ? <>
            <div style={{color: '#ff5959', clear: 'both', display: 'flex', justifyContent: 'center', margin: '20px'}}>
                <Icon icon={{icon: 'error_outline', size: 'xsmall'}}/>
                <span style={{padding: '3px'}}>{errS}</span>
            </div>
        </> : <></>
        return <div style={{
            width: this.props.isMobile ? 'calc(100vw - 60px)' : '380px',
            padding: `5px ${this.props.isMobile ? 30 : 60}px`,
            float: 'left'
        }}>
            <TextField style={{width: '100%', height: '100%'}} outlined value={this.state?.email}
                       onChange={e => this.handleChange(e, 'email')} label="이메일" onKeyDown={(e) => {
                if (e.key === 'Enter') focusNextInput()
            }} ref={(input) => {
                this.firstInput = input
            }}/>
            <div style={{width: '100%', height: '20px'}}/>
            <TextField style={{width: '100%', height: '100%'}} outlined value={this.state?.name}
                       onChange={e => this.handleChange(e, 'name')} label="이름" onKeyDown={(e) => {
                if (e.key === 'Enter') this.props.next()
            }}/>
            {errMessage}
            <div style={{width: '100%', height: '20px'}}/>
            <div style={{clear: 'both', marginTop: '20px', marginBottom: '20px'}}>
                <Button style={{float: 'right'}} raised onClick={this.props.next}
                        disabled={!this.props.context.get('loaded')}>다음</Button>
            </div>
        </div>
    }
}


export class FindPassword extends React.Component<any, IProps> {
    firstInput: any

    constructor(props: IProps) {
        super(props)
    }

    public componentDidMount() {
        window.addEventListener('loginStateUpdate', () => {
            this.forceUpdate()
        })
        window.addEventListener('focusFrame', (e: CustomEvent) => {
            if (e.detail.frame === 'FindPassword') this.firstInput.focus()
        })
    }

    public handleChange(e: React.FormEvent<HTMLInputElement>, target: string) {
        // @ts-ignore
        this.setState({[target]: e.target.value})
        // @ts-ignore
        this.props.context.set('signup_' + target, e.target.value)
    }

    public render() {
        return <div style={{
            width: this.props.isMobile ? 'calc(100vw - 60px)' : '380px',
            padding: `5px ${this.props.isMobile ? 30 : 60}px`,
            float: 'left'
        }}>
        </div>
    }
}
