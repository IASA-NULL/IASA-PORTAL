import * as React from 'react'
import { Typography } from '@rmwc/typography'
import { Button } from '@rmwc/button'

class MyeonbulBoss extends React.Component<any, {}> {
    public print() {
        window.print()
    }

    public render() {
        return (
            <>
                <Button onClick={this.print} style={{ width: '100%' }}>
                    출력하기
                </Button>
                <hr style={{ margin: '0' }} />
            </>
        )
    }
}

export default MyeonbulBoss
