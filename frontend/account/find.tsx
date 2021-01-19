import * as React from "react";
import { TextField } from "@rmwc/textfield";
import { Button } from "@rmwc/button";

interface IProps {
    setState: any;
    isMobile: boolean;
    context: any;
}

export class FindID extends React.Component<IProps, undefined> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <div
                style={{
                    width: this.props.isMobile ? "calc(100vw - 60px)" : "380px",
                    padding: `5px ${this.props.isMobile ? 30 : 60}px`,
                    float: "left",
                }}
            ></div>
        );
    }
}

export class FindPassword extends React.Component<any, IProps> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return (
            <div
                style={{
                    width: this.props.isMobile ? "calc(100vw - 60px)" : "380px",
                    padding: `5px ${this.props.isMobile ? 30 : 60}px`,
                    float: "left",
                }}
            ></div>
        );
    }
}
