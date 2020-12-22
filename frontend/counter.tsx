import * as React from 'react'
import {Button} from '@rmwc/button'
import {Typography} from '@rmwc/typography'

interface CounterProps {
    startNumber: number;
}

interface CounterState {
    number: number;
}

class Counter extends React.Component<CounterProps, CounterState> {
    public state = {
        number: 0,
    }

    constructor(props: CounterProps) {
        super(props)
        this.state.number = props.startNumber;
    }

    public handleClick = () => {
        this.setState({
            number: this.state.number + 1,
        })
    }

    public render() {
        return <div>
            <Typography use="headline1">{this.state.number}</Typography>
            <br/>
            <br/>
            <Button onClick={this.handleClick} outlined>증가</Button>
        </div>
    }
}

export default Counter
