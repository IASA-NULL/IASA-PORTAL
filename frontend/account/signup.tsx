import * as React from 'react'
import { TextField } from '@rmwc/textfield'
import { Button } from '@rmwc/button'
import { Icon } from '@rmwc/icon'
import { Checkbox } from '@rmwc/checkbox'
import { CollapsibleList, SimpleListItem, List } from '@rmwc/list'
import { Typography } from '@rmwc/typography'

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

interface SignupTermFormProps {
    isMobile: boolean
    context: any
    next?: any
}

interface SignupTermFormState {
    agreeTerms: boolean
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

export class SignupTerms extends React.Component<
    SignupTermFormProps,
    SignupTermFormState
> {
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
                <List>
                    <CollapsibleList
                        handle={
                            <SimpleListItem
                                text='이용약관'
                                graphic='subject'
                                metaIcon='chevron_right'
                            />
                        }>
                        <div>
                            <Typography
                                use='headline3'
                                id='cont_index'
                                style={{ marginTop: '0' }}>
                                IASA Portal 약관
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline4' id='cont_welcome'>
                                여러분을 환영합니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                IASA Portal 및 제품(이하 ‘서비스’)을 이용해
                                주셔서 감사합니다. 본 약관은 다양한 IASA
                                Portal의 서비스의 이용과 관련하여 IASA Portal
                                서비스를 제공하는 IASA 정보동아리 NULL(이하
                                ‘NULL’)과 이를 이용하는 IASA Portal 서비스
                                회원(이하 ‘회원’)과의 관계를 설명하며, 아울러
                                여러분의 서비스 이용에 도움이 될 수 있는 유익한
                                정보를 포함하고 있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                서비스를 이용하시거나 서비스 회원으로 가입하실
                                경우 여러분은 본 약관 및 관련 운영 정책을
                                확인하거나 동의하게 되므로, 잠시 시간을 내시여
                                주의 깊게 살펴봐 주시기 바랍니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline4' id='cont_services'>
                                다양한 IASA Portal의 서비스를 즐겨보세요.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                {' '}
                                IASA Portal은 www.iasa.kr을 비롯한 IASA Portal
                                도메인의 웹사이트 및 응용프로그램(어플리케이션,
                                앱)을 통해 다른 이용자와의 커뮤니케이션, 콘텐츠
                                제공, 학교 관련 전산 처리 등 여러분의 생활에
                                편리함을 더할 수 있는 다양한 서비스를 제공하고
                                있습니다. 여러분은 PC, 태블릿 등 인터넷 이용이
                                가능한 각종 단말기를 통해 각양각색의 IASA
                                Portal의 서비스를 자유롭게 이용하실 수 있으며,
                                개별 서비스들의 구체적인 내용은 각 서비스 상의
                                안내, 공지사항, NULL 또는 도움말 등에서 쉽게
                                확인하실 수 있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                IASA Portal는 회원이 학생/학부모/교사인 경우에
                                따라 각각 다른 서비스를 제공할 수도 있습니다.
                                자세한 내용은 역시 각 서비스 상의 안내,
                                공지사항, 도움말 등에서 확인하실 수 있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                서비스에는 기본적으로 본 약관이 적용됩니다만
                                IASA Portal이 다양한 서비스를 제공하는 과정에서
                                부득이 본 약관 외 별도의 약관, 운영정책 등을
                                적용하는 경우가 있습니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline4' id='cont_account'>
                                계정을 사용해서 IASA Portal의 모든 기능을
                                즐겨보세요.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                여러분은 본 약관을 읽고 동의하신 후 회원 가입을
                                신청하실 수 있으며, IASA Portal은 이에 대한
                                승낙을 통해 회원 가입 절차를 완료하고 여러분께
                                서비스 이용 계정(이하 ‘계정’)을 부여합니다.
                                계정이란 회원이 서비스에 로그인한 이후 이용하는
                                각종 서비스 이용 이력을 회원 별로 관리하기 위해
                                설정한 회원 식별 단위를 말합니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                아쉽게도, 대부분의 IASA Portal의 기능을 사용하기
                                위해서는 계정이 필요합니다. 이와 관련한 상세한
                                내용은 계정 운영정책 및 고객센터 내 IASA Portal
                                회원가입 방법 등에서 확인해 주세요.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline4' id='cont_contents'>
                                여러분이 제공한 콘텐츠를 소중히 다룰 것입니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 여러분이 게재한 게시물이 서비스를
                                통해 다른 이용자들에게 전달되어 우리 모두의 삶을
                                더욱 풍요롭게 해줄 것을 기대합니다. 게시물은
                                여러분이 타인 또는 자신이 보게 할 목적으로
                                서비스 상에 게재한 부호, 문자, 음성, 음향, 그림,
                                사진, 동영상, 링크 등으로 구성된 각종 콘텐츠
                                자체 또는 파일을 말합니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 여러분의 생각과 감정이 표현된
                                콘텐츠를 소중히 보호할 것을 약속 드립니다.
                                여러분이 제작하여 게재한 게시물에 대한
                                지식재산권 등의 권리는 당연히 여러분에게
                                있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 여러분이 부여해 주신 콘텐츠 이용
                                권한을 저작권법 등 관련 법령에서 정하는 바에
                                따라 IASA Portal 서비스 내 노출, 서비스 홍보를
                                위한 활용, 서비스 운영, 개선 및 새로운 서비스
                                개발을 위한 연구, 웹 접근성 등 법률상 의무 준수,
                                외부 사이트에서의 검색, 수집 및 링크 허용을
                                위해서만 제한적으로 행사할 것입니다. 만약, 그
                                밖의 목적을 위해 부득이 여러분의 콘텐츠를
                                이용하고자 할 경우엔 사전에 여러분께 설명을
                                드리고 동의를 받도록 하겠습니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline4' id='cont_userdata'>
                                여러분의 개인정보를 소중히 보호합니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 서비스의 원활한 제공을 위하여
                                회원이 동의한 목적과 범위 내에서만 개인정보를
                                수집.이용하며, 개인정보 보호 관련 법령에 따라
                                안전하게 관리합니다. IASA Portal이 이용자 및
                                회원에 대해 관련 개인정보를 안전하게 처리하기
                                위하여 기울이는 노력이나 기타 상세한 사항은
                                개인정보 처리방침에서 확인하실 수 있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 여러분이 서비스를 이용하기 위해
                                일정 기간 동안 로그인 혹은 접속한 기록이 없는
                                경우, 전자메일, 서비스 내 알림 또는 기타 적절한
                                전자적 수단을 통해 사전에 안내해 드린 후
                                여러분의 정보를 파기하거나 분리 보관할 수
                                있으며, 만약 이로 인해 서비스 제공을 위해
                                필수적인 정보가 부족해질 경우 부득이 관련 서비스
                                이용계약을 해지할 수 있습니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline4' id='cont_otherright'>
                                타인의 권리를 존중해 주세요.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                여러분이 무심코 게재한 게시물로 인해 타인의
                                저작권이 침해되거나 명예훼손 등 권리 침해가
                                발생할 수 있습니다. IASA Portal은 이에 대한 문제
                                해결을 위해 ‘정보통신망 이용촉진 및 정보보호
                                등에 관한 법률’ 및 ‘저작권법’ 등을 근거로
                                권리침해 주장자의 요청에 따른 게시물 게시중단,
                                원 게시자의 이의신청에 따른 해당 게시물 게시
                                재개 등을 내용으로 하는 게시중단요청서비스를
                                운영하고 있습니다. 보다 상세한 내용 및 절차는
                                고객센터 내 게시중단요청서비스 소개를 참고해
                                주세요.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                한편, IASA Portal 서비스를 통해 타인의 콘텐츠를
                                이용한다고 하여 여러분이 해당 콘텐츠에 대한
                                지식재산권을 보유하게 되는 것은 아닙니다.
                                여러분이 해당 콘텐츠를 자유롭게 이용하기
                                위해서는 그 이용이 저작권법 등 관련 법률에 따라
                                허용되는 범위 내에 있거나, 해당 콘텐츠의
                                지식재산권자로부터 별도의 이용 허락을 받아야
                                하므로 각별한 주의가 필요합니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 여러분이 IASA Portal 서비스를
                                마음껏 이용할 수 있도록 여러분께 IASA Portal
                                서비스에 수반되는 관련 소프트웨어 사용에 관한
                                이용 권한을 부여합니다. 이 경우 여러분의
                                자유로운 이용은 IASA Portal이 제시하는 이용
                                조건에 부합하는 범위 내에서만 허용되고, 이러한
                                권한은 양도가 불가능하며, 비독점적 조건 및
                                법적고지가 적용된다는 점을 유의해 주세요.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline4' id='cont_caution'>
                                IASA Portal 서비스 이용과 관련하여 몇 가지
                                주의사항이 있습니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 여러분이 IASA Portal 서비스를
                                자유롭고 편리하게 이용할 수 있도록 최선을 다하고
                                있습니다. 다만, 여러분이 IASA Portal 서비스를
                                보다 안전하게 이용하고 IASA Portal 서비스에서
                                여러분과 타인의 권리가 서로 존중되고
                                보호받으려면 여러분의 도움과 협조가 필요합니다.
                                여러분의 안전한 서비스 이용과 권리 보호를 위해
                                부득이 아래와 같은 경우 여러분의 게시물 게재나
                                IASA Portal 서비스 이용이 제한될 수 있으므로,
                                이에 대한 확인 및 준수를 요청 드립니다.
                            </Typography>
                            <br />
                            <ul>
                                <li>
                                    회원 가입 시 학번, 이름 등의 정보를 허위로
                                    기재해서는 안 됩니다. 회원 계정에 등록된
                                    정보는 항상 정확한 최신 정보가 유지될 수
                                    있도록 관리해 주세요. 자신의 계정을 다른
                                    사람에게 판매, 양도, 대여 또는 담보로
                                    제공하거나 다른 사람에게 그 사용을
                                    허락해서는 안 됩니다. 아울러 자신의 계정이
                                    아닌 타인의 계정을 무단으로 사용해서는 안
                                    됩니다. 이에 관한 상세한 내용은 계정
                                    운영정책을 참고해 주시기 바랍니다.
                                </li>
                                <li>
                                    타인에 대해 직접적이고 명백한 신체적 위협을
                                    가하는 내용의 게시물, 타인의 자해 행위 또는
                                    자살을 부추기거나 권장하는 내용의 게시물,
                                    타인의 신상정보, 사생활 등 비공개 개인정보를
                                    드러내는 내용의 게시물, 타인을 지속적으로
                                    따돌리거나 괴롭히는 내용의 게시물, 성매매를
                                    제안, 알선, 유인 또는 강요하는 내용의
                                    게시물, 공공 안전에 대해 직접적이고 심각한
                                    위협을 가하는 내용의 게시물은 제한될 수
                                    있습니다.
                                </li>
                                <li>
                                    관련 법령상 금지되거나 형사처벌의 대상이
                                    되는 행위를 수행하거나 이를 교사 또는
                                    방조하는 등의 범죄 관련 직접적인 위험이
                                    확인된 게시물, 관련 법령에서 홍보, 광고,
                                    판매 등을 금지하고 있는 물건 또는 서비스를
                                    홍보, 광고, 판매하는 내용의 게시물, 타인의
                                    지식재산권 등을 침해하거나 모욕, 사생활 침해
                                    또는 명예훼손 등 타인의 권리를 침해하는
                                    내용이 확인된 게시물은 제한될 수 있습니다.
                                </li>
                                <li>
                                    자극적이고 노골적인 성행위를 묘사하는 등
                                    타인에게 성적 수치심을 유발시키거나 왜곡된
                                    성 의식 등을 야기할 수 있는 내용의 게시물,
                                    타인에게 잔혹감 또는 혐오감을 일으킬 수 있는
                                    폭력적이고 자극적인 내용의 게시물, 본인
                                    이외의 자를 사칭하거나 허위사실을 주장하는
                                    등 타인을 기만하는 내용의 게시물, 과도한
                                    욕설, 비속어 등을 계속하여 반복적으로
                                    사용하여 심한 혐오감 또는 불쾌감을 일으키는
                                    내용의 게시물은 제한될 수 있습니다.
                                </li>
                                <li>
                                    자동화된 수단을 활용하는 등 IASA Portal
                                    서비스의 기능을 비정상적으로 이용하여 게재된
                                    게시물, IASA Portal 각 개별 서비스의 제공
                                    취지와 부합하지 않는 내용의 게시물은 다른
                                    이용자들의 정상적인 IASA Portal 서비스
                                    이용에 불편을 초래하고 더 나아가 IASA
                                    Portal의 원활한 서비스 제공을 방해하므로
                                    역시 제한될 수 있습니다. 기타 제한되는
                                    게시물에 관한 상세한 내용은 게시물 운영정책
                                    및 각 개별 서비스에서의 약관, 운영정책 등을
                                    참고해 주시기 바랍니다.
                                </li>
                                <li>
                                    IASA Portal의 사전 허락 없이 자동화된
                                    수단(예: 매크로 프로그램, 로봇(봇), 크롤러
                                    등)을 이용하여 IASA Portal 서비스 회원으로
                                    가입을 시도 또는 가입하거나, IASA Portal
                                    서비스에 로그인을 시도 또는 로그인하거나,
                                    IASA Portal 서비스 상에 게시물을 게재하거나,
                                    IASA Portal 서비스를 통해
                                    커뮤니케이션하거나(예: 전자메일, 쪽지 등),
                                    IASA Portal 서비스에 게재된 회원의
                                    아이디(ID), 게시물 등을 수집하는 등
                                    이용자(사람)의 실제 이용을 전제로 하는 IASA
                                    Portal 서비스의 제공 취지에 부합하지 않는
                                    방식으로 IASA Portal 서비스를 이용하거나
                                    이와 같은 IASA Portal 서비스에 대한
                                    어뷰징(남용) 행위를 막기 위한 IASA Portal의
                                    기술적 조치를 무력화하려는 일체의 행위(예:
                                    IP를 지속적으로 바꿔가며 접속하는 행위,
                                    Captcha를 외부 솔루션 등을 통해 우회하거나
                                    무력화 하는 행위 등)를 시도해서는 안 됩니다.
                                </li>
                            </ul>
                            <Typography use='body1'>
                                {' '}
                                IASA Portal은 본 약관의 범위 내에서 게시물
                                운영정책, 각 개별 서비스에서의 약관 또는
                                운영정책, 각 서비스 상의 안내, 공지사항,
                                고객센터 도움말 등을 두어, 여러분에게 안정적이고
                                원활한 서비스 이용이 가능하도록 지원하고
                                있습니다. 각 세부 정책에는 여러분이 참고할 수
                                있도록 보다 구체적인 유의사항을 포함하고 있으니,
                                본 약관 본문 및 구성 페이지 상의 링크 등을 통해
                                이를 확인해 주시기 바랍니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline4' id='cont_stop'>
                                부득이 서비스 이용을 제한할 경우 합리적인 절차를
                                준수합니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 다양한 정보와 의견이 담긴 여러분의
                                콘텐츠를 소중히 다룰 것을 약속드립니다만,
                                여러분이 게재한 게시물이 관련 법령, 본 약관,
                                게시물 운영정책, 각 개별 서비스에서의 약관,
                                운영정책 등에 위배되는 경우, 부득이 이를 비공개
                                또는 삭제 처리하거나 게재를 거부할 수 있습니다.
                                다만, 이것이 IASA Portal가 모든 콘텐츠를 검토할
                                의무가 있다는 것을 의미하지는 않습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                또한 여러분이 관련 법령, 본 약관, 계정 및 게시물
                                운영정책, 각 개별 서비스에서의 약관, 운영정책
                                등을 준수하지 않을 경우, IASA Portal은 여러분의
                                관련 행위 내용을 확인할 수 있으며, 그 확인
                                결과에 따라 IASA Portal 서비스 이용에 대한
                                주의를 당부하거나, IASA Portal 서비스 이용을
                                일부 또는 전부, 일시 또는 영구히 정지시키는 등
                                그 이용을 제한할 수 있습니다. 한편, 이러한 이용
                                제한에도 불구하고 더 이상 IASA Portal 서비스
                                이용계약의 온전한 유지를 기대하기 어려운 경우엔
                                부득이 여러분과의 이용계약을 해지할 수 있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                부득이 여러분의 서비스 이용을 제한해야 할 경우
                                명백한 법령 위반이나 타인의 권리침해로서 긴급한
                                위험 또는 피해 차단이 요구되는 사안 외에는 위와
                                같은 단계적 서비스 이용제한 원칙을 준수
                                하겠습니다. 명백한 법령 위반 등을 이유로 부득이
                                서비스 이용을 즉시 영구 정지시키는 경우 서비스
                                이용을 통해 획득한 포인트 및 기타 혜택 등은 모두
                                소멸되고 이에 대해 별도로 보상하지 않으므로
                                유의해 주시기 바랍니다. 서비스 이용 제한의 조건,
                                세부 내용 등은 계정 운영정책 및 각 개별
                                서비스에서의 운영정책을 참고하시기 바랍니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline4' id='cont_response'>
                                IASA Portal의 잘못은 NULL이 책임집니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 여러분이 IASA Portal 서비스를
                                이용함에 있어 IASA Portal의 고의 또는 과실로
                                인하여 손해를 입게 될 경우 관련 법령에 따라
                                여러분의 피해를 책임집니다. 다만, 천재지변 또는
                                이에 준하는 불가항력으로 인하여 IASA Portal이
                                서비스를 제공할 수 없거나 이용자의 고의 또는
                                과실로 인하여 서비스를 이용할 수 없어 발생한
                                손해에 대해서 IASA Portal은 책임을 부담하지
                                않습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                그리고 IASA Portal이 손해배상책임을 부담하는
                                경우에도 통상적으로 예견이 불가능하거나 특별한
                                사정으로 인한 특별 손해 또는 간접 손해, 기타
                                징벌적 손해에 대해서는 관련 법령에 특별한 규정이
                                없는 한 책임을 부담하지 않습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                한편, IASA Portal 서비스를 매개로 한 여러분과
                                다른 회원 간 또는 여러분과 비회원 간의 의견
                                교환, 거래 등에서 발생한 손해나 여러분이 서비스
                                상에 게재된 타인의 게시물 등의 콘텐츠를
                                신뢰함으로써 발생한 손해에 대해서도 IASA
                                Portal은 특별한 사정이 없는 한 이에 대해 책임을
                                부담하지 않습니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline4' id='cont_change'>
                                서비스 중단 또는 변경 시 꼭 알려드리겠습니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 연중 무휴, 1일 24시간 안정적으로
                                서비스를 제공하기 위해 최선을 다하고 있습니다만,
                                컴퓨터, 서버 등 정보통신설비의 보수점검, 교체
                                또는 고장, 통신두절 등 운영상 상당한 이유가 있는
                                경우 부득이 서비스의 전부 또는 일부를 중단할 수
                                있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                한편, IASA Portal은 서비스 운영 또는 개선을 위해
                                상당한 필요성이 있는 경우 서비스의 전부 또는
                                일부를 수정, 변경 또는 종료할 수 있습니다.
                                무료로 제공되는 서비스의 전부 또는 일부를 수정,
                                변경 또는 종료하게 된 경우 관련 법령에 특별한
                                규정이 없는 한 별도의 보상을 하지 않습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                이 경우 IASA Portal은 예측 가능한 경우 상당기간
                                전에 이를 안내하며, 만약 예측 불가능한 경우라면
                                사후 지체 없이 상세히 설명하고 안내
                                드리겠습니다. 또한 서비스 중단의 경우에는 여러분
                                자신의 콘텐츠를 백업할 수 있도록 합리적이고
                                충분한 기회를 제공하도록 하겠습니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline4' id='cont_hear'>
                                주요 사항을 잘 안내하고 여러분의 소중한 의견에
                                귀 기울이겠습니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 서비스 이용에 필요한 주요사항을
                                적시에 잘 안내해 드릴 수 있도록 힘쓰겠습니다.
                                회원에게 통지를 하는 경우 전자메일, 서비스 내
                                알림 또는 기타 적절한 전자적 수단을 통해
                                개별적으로 알려 드릴 것이며, 다만 회원 전체에
                                대한 통지가 필요할 경우엔 7일 이상 www.iasa.kr
                                을 비롯한 IASA Portal 도메인의 웹사이트 및
                                응용프로그램(어플리케이션, 앱) 초기 화면 또는
                                공지사항 등에 관련 내용을 게시하도록 하겠습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 여러분의 소중한 의견에 귀
                                기울이겠습니다. 여러분은 언제든지 고객센터를
                                통해 서비스 이용과 관련된 의견이나 개선사항을
                                전달할 수 있으며, IASA Portal은 합리적 범위
                                내에서 가능한 그 처리과정 및 결과를 여러분께
                                전달할 수 있도록 하겠습니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline4' id='cont_alert'>
                                여러분이 쉽게 알 수 있도록 약관 및 운영정책을
                                게시하며 사전 공지 후 개정합니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 본 약관의 내용을 여러분이 쉽게
                                확인할 수 있도록 서비스 초기 화면에 게시하고
                                있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 수시로 본 약관, 계정 및 게시물
                                운영정책을 개정할 수 있습니다만, 관련 법령을
                                위배하지 않는 범위 내에서 개정할 것이며, 사전에
                                그 개정 이유와 적용 일자를 서비스 내에 알리도록
                                하겠습니다. 또한 여러분에게 불리할 수 있는
                                중대한 내용의 약관 변경의 경우에는 최소 30일
                                이전에 해당 서비스 내 공지하고 별도의 전자적
                                수단(전자메일, 서비스 내 알림 등)을 통해
                                개별적으로 알릴 것입니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                IASA Portal은 변경된 약관을 게시한 날로부터
                                효력이 발생되는 날까지 약관 변경에 대한 여러분의
                                의견을 기다립니다. 위 기간이 지나도록 여러분의
                                의견이 IASA Portal에 접수되지 않으면, 여러분이
                                변경된 약관에 따라 서비스를 이용하는 데에
                                동의하는 것으로 간주됩니다. IASA Portal으로서는
                                매우 안타까운 일이지만, 여러분이 변경된 약관에
                                동의하지 않는 경우 변경된 약관의 적용을 받는
                                해당 서비스의 제공이 더 이상 불가능하게 될 수
                                있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                IASA Portal의 서비스에는 기본적으로 본 약관이
                                적용됩니다만, 부득이 각 개별 서비스의 고유한
                                특성을 반영하기 위해 본 약관 외 별도의 약관,
                                운영정책이 추가로 적용될 때가 있습니다. 따라서
                                별도의 약관, 운영정책에서 그 개별 서비스 제공에
                                관하여 본 약관, 계정 및 게시물 운영정책과 다르게
                                정한 경우에는 별도의 약관, 운영정책이 우선하여
                                적용됩니다. 이러한 내용은 각각의 개별 서비스
                                초기 화면에서 확인해 주시기 바랍니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                본 약관은 한국어를 정본으로 합니다. 본 약관 또는
                                서비스와 관련된 여러분과 IASA Portal와의
                                관계에는 대한민국의 법령이 적용됩니다. 그리고 본
                                약관 또는 IASA Portal 서비스와 관련하여 여러분과
                                IASA Portal 사이에 분쟁이 발생할 경우, 그 분쟁의
                                처리는 대한민국 '민사소송법'에서 정한 절차를
                                따릅니다.
                            </Typography>
                            <br />
                            <ul>
                                <li>공지 일자: 2020년 2월 26일</li>
                                <li>적용 일자: 2020년 3월 1일</li>
                            </ul>
                            <Typography use='body1'>
                                IASA Portal의 서비스와 관련하여 궁금하신 사항이
                                있으시면 NULL로 문의 주시기 바랍니다.
                            </Typography>
                            <br />
                        </div>
                    </CollapsibleList>
                    <CollapsibleList
                        handle={
                            <SimpleListItem
                                text='개인정보 처리방침'
                                graphic='subject'
                                metaIcon='chevron_right'
                            />
                        }>
                        <div>
                            <Typography use='headline3' id='cont_index'>
                                개인정보 처리방침
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                NULL은 서비스 기획부터 종료까지 정보통신망
                                이용촉진 및 정보보호 등에 관한 법률(이하
                                '정보통신망법'), 개인정보보호법 등 국내의
                                개인정보 보호 법령을 철저히 준수합니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                또한 OECD의 개인정보 보호 가이드라인 등
                                국제기준을 준수하여 서비스를 제공합니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline5' id='cont_why'>
                                개인정보처리방침의 의의
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                NULL는 본 개인정보처리방침을 정보통신망법을
                                기준으로 작성하되, NULL 내에서의 이용자 개인정보
                                처리 현황을 최대한 알기 쉽고 상세하게 설명하기
                                위해 노력하였습니다. 이는 쉬운 용어를 사용한
                                개인정보처리방침 작성 원칙인 ‘Plain Language
                                Privacy Policy(쉬운 용어를 사용한
                                개인정보처리방침)’를 도입한 것입니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                개인정보처리방침은 다음과 같은 중요한 의미를
                                가지고 있습니다.
                            </Typography>
                            <br />
                            <ul>
                                <li>
                                    NULL이 어떤 정보를 수집하고, 수집한 정보를
                                    어떻게 사용하며, 필요에 따라 누구와 이를
                                    공유(‘위탁 또는 제공’)하며, 이용목적을
                                    달성한 정보를 언제・어떻게 파기하는지 등
                                    ‘개인정보의 한살이’와 관련한 정보를 투명하게
                                    제공합니다.
                                </li>
                                <li>
                                    정보주체로서 이용자는 자신의 개인정보에 대해
                                    어떤 권리를 가지고 있으며, 이를 어떤 방법과
                                    절차로 행사할 수 있는지를 알려드립니다.
                                    또한, 법정대리인(부모 등)이 만14세 미만
                                    아동의 개인정보 보호를 위해 어떤 권리를
                                    행사할 수 있는지도 함께 안내합니다.
                                </li>
                                <li>
                                    개인정보 침해사고가 발생하는 경우, 추가적인
                                    피해를 예방하고 이미 발생한 피해를 복구하기
                                    위해 누구에게 연락하여 어떤 도움을 받을 수
                                    있는지 알려드립니다.
                                </li>
                                <li>
                                    그 무엇보다도, 개인정보와 관련하여 NULL과
                                    이용자간의 권리 및 의무 관계를 규정하여
                                    이용자의 ‘개인정보자기결정권’을 보장하는
                                    수단이 됩니다.
                                </li>
                            </ul>
                            <br />
                            <Typography use='headline5' id='cont_collect'>
                                수집하는 개인정보
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                회원가입 시점에 NULL이 이용자로부터 수집하는
                                개인정보는 아래와 같습니다.
                            </Typography>
                            <br />
                            <ul>
                                <li>
                                    회원 가입 시에 ‘아이디, 비밀번호, 이름,
                                    생년월일, 성별, 휴대전화번호, 이메일 주소’를
                                    필수항목으로 수집합니다. 그리고 선택항목으로
                                    프로필 정보를 수집합니다.
                                </li>
                            </ul>
                            <Typography use='subtitle1'>
                                서비스 이용 과정에서 이용자로부터 수집하는
                                개인정보는 아래와 같습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                또한 이미지 및 음성을 이용한 검색 서비스 등에서
                                이미지나 음성이 수집될 수 있습니다. IASA PORTAL
                                내의 개별 서비스 이용 과정에서 해당 서비스의
                                이용자에 한해 추가 개인정보 수집이 발생할 수
                                있습니다. 추가로 개인정보를 수집할 경우에는 해당
                                개인정보 수집 시점에서 이용자에게 ‘수집하는
                                개인정보 항목, 개인정보의 수집 및 이용목적,
                                개인정보의 보관기간’에 대해 안내 드리고 동의를
                                받습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                서비스 이용 과정에서 IP 주소, 쿠키, 서비스 이용
                                기록, 기기정보가 생성되어 수집될 수 있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                또한 이미지 및 음성을 이용한 검색 서비스 등에서
                                이미지나 음성이 수집될 수 있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                구체적으로 1) 서비스 이용 과정에서 이용자에 관한
                                정보를 자동화된 방법으로 생성하여 이를
                                저장(수집)하거나, 2) 이용자 기기의 고유한 정보를
                                원래의 값을 확인하지 못 하도록 안전하게 변환하여
                                수집합니다. 이와 같이 수집된 정보는 개인정보와의
                                연계 여부 등에 따라 개인정보에 해당할 수 있고,
                                개인정보에 해당하지 않을 수도 있습니다.
                            </Typography>
                            <br />
                            <Typography use='subtitle1'>
                                NULL은 아래의 방법을 통해 개인정보를 수집합니다.
                            </Typography>
                            <br />
                            <ul>
                                <li>
                                    회원가입 및 서비스 이용 과정에서 이용자가
                                    개인정보 수집에 대해 동의를 하고 직접 정보를
                                    입력하는 경우, 해당 개인정보를 수집합니다.
                                </li>
                                <li>
                                    고객센터를 통한 상담 과정에서 웹페이지,
                                    메일, 팩스, 전화 등을 통해 이용자의
                                    개인정보가 수집될 수 있습니다.
                                </li>
                                <li>
                                    NULL과 제휴한 외부 단체로부터 개인정보를
                                    제공받을 수 있으며, 이러한 경우에는
                                    정보통신망법에 따라 제휴사에서 이용자에게
                                    개인정보 제공 동의 등을 받은 후에 NULL에
                                    제공합니다.
                                </li>
                                <li>
                                    기기정보와 같은 생성정보는 PC웹, 모바일
                                    웹/앱 이용 과정에서 자동으로 생성되어 수집될
                                    수 있습니다.
                                </li>
                            </ul>
                            <br />
                            <Typography use='headline5' id='cont_usage'>
                                수집한 개인정보의 이용
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                IASA PORTAL 및 IASA PORTAL 관련 제반
                                서비스(모바일 웹/앱 포함)의 회원관리, 서비스
                                개발·제공 및 향상, 안전한 인터넷 이용환경 구축
                                등 아래의 목적으로만 개인정보를 이용합니다.
                            </Typography>
                            <br />
                            <ul>
                                <li>
                                    회원 가입 의사의 확인, 연령 확인 및
                                    법정대리인 동의 진행, 이용자 및 법정대리인의
                                    본인 확인, 이용자 식별, 회원탈퇴 의사의 확인
                                    등 회원관리를 위하여 개인정보를 이용합니다.
                                </li>
                                <li>
                                    법령 및 IASA Portal 이용약관을 위반하는
                                    회원에 대한 이용 제한 조치, 부정 이용 행위를
                                    포함하여 서비스의 원활한 운영에 지장을 주는
                                    행위에 대한 방지 및 제재, 계정도용 및
                                    부정거래 방지, 약관 개정 등의 고지사항 전달,
                                    분쟁조정을 위한 기록 보존, 민원처리 등
                                    이용자 보호 및 서비스 운영을 위하여
                                    개인정보를 이용합니다.
                                </li>
                                <li>
                                    서비스 이용기록과 접속 빈도 분석, 서비스
                                    이용에 대한 통계, 서비스 분석 및 통계에 따른
                                    맞춤 서비스 제공 및 광고 게재 등에
                                    개인정보를 이용합니다.
                                </li>
                                <li>
                                    보안, 프라이버시, 안전 측면에서 이용자가
                                    안심하고 이용할 수 있는 서비스 이용환경
                                    구축을 위해 개인정보를 이용합니다.
                                </li>
                            </ul>
                            <br />
                            <Typography use='headline5' id='cont_give'>
                                개인정보의 제공 및 위탁
                            </Typography>
                            <br />
                            <br />
                            <Typography use='subtitle1'>
                                NULL은 원칙적으로 이용자 동의 없이 개인정보를
                                외부에 제공하지 않습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                NULL은 이용자의 사전 동의 없이 개인정보를 외부에
                                제공하지 않습니다. 단, 이용자가 외부 제휴사의
                                서비스를 이용하기 위하여 개인정보 제공에 직접
                                동의를 한 경우, 그리고 관련 법령에 의거해 NULL에
                                개인정보 제출 의무가 발생한 경우, 이용자의
                                생명이나 안전에 급박한 위험이 확인되어 이를
                                해소하기 위한 경우에 한하여 개인정보를 제공하고
                                있습니다.
                            </Typography>
                            <br />
                            <Typography use='subtitle1'>
                                NULL은 편리하고 더 나은 서비스를 제공하기 위해
                                업무 중 일부를 외부에 위탁하고 있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                NULL은 서비스 제공을 위하여 필요한 업무 중
                                일부를 외부 업체에 위탁하고 있으며, 위탁받은
                                업체가 정보통신망법에 따라 개인정보를 안전하게
                                처리 하도록 필요한 사항을 규정하고 관리/감독을
                                하고 있습니다. NULL이 수탁업체에 위탁하는 업무와
                                관련된 서비스를 이용하지 않는 경우, 이용자의
                                개인정보가 수탁업체에 제공되지 않습니다.
                            </Typography>
                            <br />
                            <table
                                className='mdc-data-table__content'
                                id='myeonbulList'>
                                <thead>
                                    <tr className='mdc-data-table__header-row'>
                                        <th className='mdc-data-table__header-cell'>
                                            수탁업체
                                        </th>
                                        <th className='mdc-data-table__header-cell'>
                                            위탁업무
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className='mdc-data-table__header-row'>
                                        <td className='mdc-data-table__cell'>
                                            Amazon Web Service
                                        </td>
                                        <td className='mdc-data-table__cell'>
                                            사이트 호스팅
                                        </td>
                                    </tr>
                                    <tr className='mdc-data-table__header-row'>
                                        <td className='mdc-data-table__cell'>
                                            CloudFlare
                                        </td>
                                        <td className='mdc-data-table__cell'>
                                            리소스 최적화, DDoS 방어
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <Typography use='body1'>
                                개인정보는 회원 탈퇴시 혹은 위탁 계약 종료시까지
                                보유 및 이용합니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline5' id='cont_destroy'>
                                개인정보의 파기
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                회사는 원칙적으로 이용자의 개인정보를 회원 탈퇴
                                시 지체없이 파기하고 있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                단, 이용자에게 개인정보 보관기간에 대해 별도의
                                동의를 얻은 경우, 또는 법령에서 일정 기간
                                정보보관 의무를 부과하는 경우에는 해당 기간 동안
                                개인정보를 안전하게 보관합니다. 통신비밀보호법
                                등 법령에서 일정기간 정보의 보관을 규정하는
                                경우는 아래와 같습니다. NULL은 이 기간 동안
                                법령의 규정에 따라 개인정보를 보관하며, 본
                                정보를 다른 목적으로는 절대 이용하지 않습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>통신비밀보호법</Typography>
                            <br />
                            <Typography use='body1'>
                                {' '}
                                - 로그인 기록: 3개월
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                회원탈퇴, 서비스 종료, 이용자에게 동의받은
                                개인정보 보유기간의 도래와 같이 개인정보의 수집
                                및 이용목적이 달성된 개인정보는 재생이 불가능한
                                방법으로 파기하고 있습니다. 법령에서 보존의무를
                                부과한 정보에 대해서도 해당 기간 경과 후
                                지체없이 재생이 불가능한 방법으로 파기합니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                전자적 파일 형태의 경우 복구 및 재생이 되지
                                않도록 기술적인 방법을 이용하여 안전하게
                                삭제하며, 출력물 등은 분쇄하거나 소각하는 방식
                                등으로 파기합니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                참고로 NULL은 ‘개인정보 유효기간제’에 따라 1년간
                                서비스를 이용하지 않은 회원의 개인정보를 별도로
                                분리 보관하여 관리하고 있습니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline5' id='cont_right'>
                                이용자 및 법정대리인의 권리와 행사 방법
                            </Typography>
                            <br />
                            <br />
                            <ul>
                                <li>
                                    이용자는 언제든지 ‘IASA PORTAL 마이페이지의
                                    회원정보’에서 자신의 개인정보를 조회하거나
                                    수정할 수 있습니다.
                                </li>
                                <li>
                                    이용자는 언제든지 ‘회원탈퇴’ 등을 통해
                                    개인정보의 수집 및 이용 동의를 철회할 수
                                    있습니다.
                                </li>
                                <li>
                                    이용자가 개인정보의 오류에 대한 정정을
                                    요청한 경우, 정정을 완료하기 전까지 해당
                                    개인정보를 이용 또는 제공하지 않습니다. 또한
                                    잘못된 개인정보를 제3자에게 이미 제공한
                                    경우에는 정정 처리결과를 제3자에게 지체 없이
                                    통지하여 정정이 이루어지도록 하겠습니다.
                                </li>
                            </ul>
                            <br />
                            <Typography use='headline5' id='cont_effort'>
                                개인정보보호를 위한 NULL의 노력
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                NULL은 이용자의 개인정보를 안전하게 관리하기
                                위하여 최선을 다하며, 정보통신망법 및
                                개인정보보호법에서 요구하는 수준 이상으로
                                개인정보를 보호하고 있습니다.
                            </Typography>
                            <br />
                            <Typography use='subtitle1'>
                                개인정보를 암호화하고 있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                법령에서 암호화를 요구하고 있는 비밀번호,
                                고유식별정보, 계좌번호 및 카드번호 외에 이메일
                                주소와 휴대폰 번호 등을 추가로 암호화 하여
                                보관하고 있습니다.
                            </Typography>
                            <br />
                            <Typography use='subtitle1'>
                                대내외의 보안 위협으로부터 개인정보를 안전하게
                                관리합니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                NULL은 개인정보의 훼손에 대비해서 자료를 수시로
                                백업하고 있고, 최신 백신프로그램을 이용하여
                                이용자들의 개인정보나 자료가 유출되거나 손상되지
                                않도록 방지하고 있습니다. 암호화 통신 등을
                                통하여 네트워크상에서 개인정보를 안전하게
                                송수신하고 있습니다.
                            </Typography>
                            <br />
                            <br />
                            <Typography use='headline5' id='cont_who'>
                                개인정보 보호책임자 및 담당자 안내
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                IASA PORTAL 이용자의 개인정보 관련 문의사항 및
                                불만 처리 등을 위하여 아래와 같이 개인정보 보호
                                책임자 및 담당자를 지정하고 있습니다.
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                개인정보 보호책임자
                            </Typography>
                            <br />
                            <Typography use='body1'>이름: 정상현</Typography>
                            <br />
                            <Typography use='body1'>소속 : NULL</Typography>
                            <br />
                            <Typography use='body1'>직위 : 부장</Typography>
                            <br />
                            <Typography use='body1'>
                                메일주소 : alrndmiro@gmail.com
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                개인정보 보호담당자
                            </Typography>
                            <br />
                            <Typography use='body1'>이름: 이서현</Typography>
                            <br />
                            <Typography use='body1'>소속 : NULL</Typography>
                            <br />
                            <Typography use='body1'>직위 : 차장</Typography>
                            <br />
                            <Typography use='body1'>
                                메일주소 : 04seohyun@gmail.com
                            </Typography>
                            <br />
                            <Typography use='body1'>
                                기타 개인정보 침해에 대한 신고나 상담이 필요한
                                경우에 아래 기관에 문의 가능합니다.
                            </Typography>
                            <br />
                            <ul>
                                <li>
                                    <a href='https://privacy.kisa.or.kr'>
                                        개인정보침해신고센터
                                    </a>{' '}
                                    (국번없이 118)
                                </li>
                                <li>
                                    <a href='https://www.spo.go.kr'>
                                        대검찰청 사이버수사과
                                    </a>{' '}
                                    (국번없이 1301)
                                </li>
                                <li>
                                    <a href='https://police.go.kr'>
                                        경찰청 사이버안전국
                                    </a>{' '}
                                    (국번없이 182)
                                </li>
                            </ul>
                            <br />
                            <Typography use='headline5' id='cont_where'>
                                본 개인정보처리방침의 적용 범위
                            </Typography>
                            <br />
                            <br />
                            <ul>
                                <li>
                                    본 개인정보처리방침은 동아리의 브랜드 중
                                    하나인 ‘
                                    <a href='https://www.iasa.kr'>
                                        IASA PORTAL
                                    </a>
                                    ’ 및 관련 제반 서비스(모바일 웹/앱 포함)에
                                    적용되며, 다른 브랜드로 제공되는 서비스에
                                    대해서는 별개의 개인정보처리방침이 적용될 수
                                    있습니다
                                </li>
                                <li>
                                    IASA PORTAL에 링크되어 있는 다른 회사의
                                    웹사이트에서 개인정보를 수집하는 경우,
                                    이용자 동의 하에 개인정보가 제공된 이후에는
                                    본 개인정보처리방침이 적용되지 않습니다.
                                </li>
                            </ul>
                            <br />
                            <Typography use='headline5' id='cont_alert'>
                                개정 전 고지 의무
                            </Typography>
                            <br />
                            <br />
                            <Typography use='body1'>
                                본 개인정보처리방침의 내용 추가, 삭제 및 수정이
                                있을 경우 개정 최소 7일 전에 ‘공지사항’을 통해
                                사전 공지를 할 것입니다. 다만, 수집하는
                                개인정보의 항목, 이용목적의 변경 등과 같이
                                이용자 권리의 중대한 변경이 발생할 때에는 최소
                                30일 전에 공지하며, 필요 시 이용자 동의를 다시
                                받을 수도 있습니다.
                            </Typography>
                            <br />
                            <ul>
                                <li>공고일자: 2020년 02월 20일</li>
                                <li>시행일자: 2020년 02월 28일</li>
                            </ul>
                        </div>
                    </CollapsibleList>
                </List>
                <br />
                <Checkbox
                    label='본인은 IASA PORTAL의 이용약관 및 개인정보처리방침에 대해 동의합니다.'
                    checked={this.state?.agreeTerms}
                    onChange={(e) =>
                        this.setState({ agreeTerms: !!e.currentTarget.checked })
                    }
                />
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
                        disabled={
                            !this.props.context.get('loaded') ||
                            !this.state?.agreeTerms
                        }>
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
