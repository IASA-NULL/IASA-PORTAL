import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { Button } from "@rmwc/button";
import { Typography } from "@rmwc/typography";
import { Select } from "@rmwc/select";

import { BrIfMobile } from "../util";
import { createSnackbarQueue, SnackbarQueue } from "@rmwc/snackbar";
import createURL from "../../scheme/url";

interface IState {
    branches: string[];
    selectedBranch: string;
}

class NotFound extends React.Component<any, IState> {
    messages: any;
    notify: any;

    constructor(props: RouteComponentProps) {
        super(props);
        let qu = createSnackbarQueue();
        this.messages = qu.messages;
        this.notify = qu.notify;
        this.update = this.update.bind(this);
        this.refresh();
    }

    public refresh() {
        fetch("https://api.github.com/repos/IASA-NULL/IASA-PORTAL/branches")
            .then((res) => res.json())
            .then((res) => {
                let branches = [] as string[];
                res.forEach((br: any) => {
                    branches.push(br.name);
                });
                this.setState({ branches: branches });
            });
    }

    public update() {
        if (!this.state?.selectedBranch) {
            this.notify({
                title: <b>오류</b>,
                body: "브랜치를 선택하세요.",
                icon: "error_outline",
                dismissIcon: true,
            });
            return;
        }
        fetch(createURL("api", "admin", "update"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ branch: this.state?.selectedBranch }),
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    this.notify({
                        title: <b>완료!</b>,
                        body: "곧 사이트가 새로 빌드될 거에요.",
                        icon: "check",
                        dismissIcon: true,
                    });
                    location.reload();
                } else
                    this.notify({
                        title: <b>오류</b>,
                        body: res.message,
                        icon: "error_outline",
                        dismissIcon: true,
                    });
            });
    }

    public render() {
        return (
            <>
                <Typography use="headline3">업데이트</Typography>
                <BrIfMobile />
                <Typography use="subtitle1" style={{ marginLeft: "10px" }}>
                    깃허브에서 사이트의 새 버전을 가져와서 업데이트해요.
                </Typography>
                <br />
                <br />
                <br />
                <Select
                    label="브랜치 선택"
                    outlined
                    enhanced
                    options={this.state?.branches || ["로드 중..."]}
                    onChange={(e) =>
                        this.setState({ selectedBranch: e.currentTarget.value })
                    }
                />
                <br />
                <Button onClick={this.update} outlined>
                    업데이트
                </Button>
                <SnackbarQueue messages={this.messages} />
            </>
        );
    }
}

export default withRouter(NotFound);
