import { Link } from 'react-router-dom'
import { ListItem, ListItemText, ListItemGraphic } from '@rmwc/list'
import * as React from 'react'
import { ChangeEvent, useEffect, useState } from 'react'
import { Menu, MenuItem, MenuSurfaceAnchor } from '@rmwc/menu'
import { TextField } from '@rmwc/textfield'
import createURL from '../scheme/url'
import { Typography } from '@rmwc/typography'
import { Permission } from '../scheme/api/auth'
import { formatTime, getToday, timeRange, TimeRange } from '../scheme/time'
import {
    Card,
    CardActionButton,
    CardActionButtons,
    CardActions,
    CardMedia,
    CardPrimaryAction,
} from '@rmwc/card'
import commonApi from '../scheme/api/commonApi'

declare const DEV_MODE: boolean

export const lightTheme = {
    primary: '#5351db',
    secondary: '#8cc4de',
    error: '#b00020',
    background: '#fff',
    surface: '#fff',
    onPrimary: 'rgba(255, 255, 255, 1)',
    onSecondary: 'rgba(255, 255, 255, 1)',
    onSurface: 'rgba(0, 0, 0, 0.87)',
    onError: '#fff',
    textPrimaryOnBackground: 'rgba(0, 0, 0, 0.87)',
    textSecondaryOnBackground: 'rgba(0, 0, 0, 0.54)',
    textHintOnBackground: 'rgba(0, 0, 0, 0.38)',
    textDisabledOnBackground: 'rgba(0, 0, 0, 0.38)',
    textIconOnBackground: 'rgba(0, 0, 0, 0.38)',
    textPrimaryOnLight: 'rgba(0, 0, 0, 0.87)',
    textSecondaryOnLight: 'rgba(0, 0, 0, 0.54)',
    textHintOnLight: 'rgba(0, 0, 0, 0.38)',
    textDisabledOnLight: 'rgba(0, 0, 0, 0.38)',
    textIconOnLight: 'rgba(0, 0, 0, 0.38)',
    textPrimaryOnDark: 'white',
    textSecondaryOnDark: 'rgba(255, 255, 255, 0.7)',
    textHintOnDark: 'rgba(255, 255, 255, 0.5)',
    textDisabledOnDark: 'rgba(255, 255, 255, 0.5)',
    textIconOnDark: 'rgba(255, 255, 255, 0.5)',
}

export const darkTheme = {
    primary: '#383870',
    secondary: '#e539ff',
    error: '#b00020',
    background: '#212121',
    surface: '#3e3e6d',
    onPrimary: 'rgba(255,255,255,.87)',
    onSecondary: 'rgba(0,0,0,0.87)',
    onSurface: 'rgba(255,255,255,.87)',
    onError: '#fff',
    textPrimaryOnBackground: 'rgba(255, 255, 255, 1)',
    textSecondaryOnBackground: 'rgba(255, 255, 255, 0.7)',
    textHintOnBackground: 'rgba(255, 255, 255, 0.5)',
    textDisabledOnBackground: 'rgba(255, 255, 255, 0.5)',
    textIconOnBackground: 'rgba(255, 255, 255, 0.5)',
    textPrimaryOnLight: 'rgba(0, 0, 0, 0.87)',
    textSecondaryOnLight: 'rgba(0, 0, 0, 0.54)',
    textHintOnLight: 'rgba(0, 0, 0, 0.38)',
    textDisabledOnLight: 'rgba(0, 0, 0, 0.38)',
    textIconOnLight: 'rgba(0, 0, 0, 0.38)',
    textPrimaryOnDark: 'white',
    textSecondaryOnDark: 'rgba(255, 255, 255, 0.7)',
    textHintOnDark: 'rgba(255, 255, 255, 0.5)',
    textDisabledOnDark: 'rgba(255, 255, 255, 0.5)',
    textIconOnDark: 'rgba(255, 255, 255, 0.5)',
}

export enum LinkType {
    a = 1,
    js,
    link,
}

export function ListLink(props: {
    body: string
    to: string
    onClick?: any
    type?: LinkType
    icon?: string
}) {
    if (props.type === LinkType.a)
        return (
            <a
                style={{
                    textDecoration: 'none',
                    color: 'black',
                    whiteSpace: 'nowrap',
                }}
                href={props.to}
                onClick={props.onClick}>
                <ListItem activated={props.to === window.location.pathname}>
                    {props.icon ? <ListItemGraphic icon={props.icon} /> : <></>}
                    <ListItemText>{props.body}</ListItemText>
                </ListItem>
            </a>
        )
    else if (props.type === LinkType.js) {
        return (
            <ListItem
                onClick={() => {
                    // @ts-ignore
                    scrollObj.scroll(
                        { el: document.getElementById(props.to), margin: 80 },
                        500
                    )
                    props.onClick()
                }}
                activated={props.to === window.location.pathname}>
                {props.icon ? <ListItemGraphic icon={props.icon} /> : <></>}
                <ListItemText>{props.body}</ListItemText>
            </ListItem>
        )
    } else
        return (
            <Link
                style={{
                    textDecoration: 'none',
                    color: 'black',
                    whiteSpace: 'nowrap',
                }}
                to={props.to}
                onClick={props.onClick}>
                <ListItem activated={props.to === window.location.pathname}>
                    {props.icon ? <ListItemGraphic icon={props.icon} /> : <></>}
                    <ListItemText>{props.body}</ListItemText>
                </ListItem>
            </Link>
        )
}

export function MenuLink(props: {
    body: string
    to: string
    onClick?: any
    type?: LinkType
}) {
    if (props.type === LinkType.a)
        return (
            <a
                style={{
                    textDecoration: 'none',
                    color: 'black',
                    whiteSpace: 'nowrap',
                }}
                href={props.to}
                onClick={props.onClick}>
                <MenuItem activated={props.to === window.location.pathname}>
                    {props.body}
                </MenuItem>
            </a>
        )
    else if (props.type === LinkType.js) {
        return (
            <MenuItem
                onClick={() => {
                    // @ts-ignore
                    scrollObj.scroll(
                        { el: document.getElementById(props.to), margin: 80 },
                        500
                    )
                    props.onClick()
                }}
                activated={props.to === window.location.pathname}>
                {props.body}
            </MenuItem>
        )
    } else
        return (
            <Link
                style={{
                    textDecoration: 'none',
                    color: 'black',
                    whiteSpace: 'nowrap',
                }}
                to={props.to}
                onClick={props.onClick}>
                <MenuItem activated={props.to === window.location.pathname}>
                    {props.body}
                </MenuItem>
            </Link>
        )
}

export function FileInput(props: any) {
    const [value, setValue] = useState('')
    let orgClickHandler: any
    if (props.onClick) orgClickHandler = props.onFocus
    let fileInput: HTMLInputElement

    return (
        <>
            <TextField
                {...props}
                value={value}
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    fileInput.click()
                    if (orgClickHandler) orgClickHandler()
                    return false
                }}
                trailingIcon={{
                    icon: 'close',
                    tabIndex: 0,
                    onClick: (e: Event) => {
                        e.preventDefault()
                        e.stopPropagation()
                        fileInput.value = ''
                        setValue('')
                        if (props.onFileSelect)
                            props.onFileSelect(fileInput.files)
                    },
                }}
            />
            <input
                style={{ display: 'none' }}
                type='file'
                onChange={() => {
                    setValue(fileInput.value)
                    if (props.onFileSelect) props.onFileSelect(fileInput.files)
                }}
                ref={(input) => {
                    fileInput = input
                }}
                accept={props?.accept}
                multiple={props?.multiple}
            />
        </>
    )
}

export function useForceUpdate() {
    const [value, setValue] = useState(0)
    return () => setValue((value) => ++value)
}

export function BrIfMobile() {
    if (window.innerWidth <= 760) return <br />
    return <></>
}

export function getCaretPosition(ctrl: any) {
    return ctrl.selectionStart
}

export function setCaretPosition(ctrl: any, pos: number) {
    if (ctrl.setSelectionRange) {
        ctrl.focus()
        ctrl.setSelectionRange(pos, pos)
    } else if (ctrl.createTextRange) {
        let range = ctrl.createTextRange()
        range.collapse(true)
        range.moveEnd('character', pos)
        range.moveStart('character', pos)
        range.select()
    }
}

export function isHidden(el: Element) {
    // @ts-ignore
    return el.offsetParent === null
}

export function focusNextInput() {
    let focussableElements =
        'a:not([disabled]), button:not([disabled]), input:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])'
    let currentEl = document.activeElement
    let first = true
    while (
        (currentEl &&
            (!currentEl.matches(focussableElements) || isHidden(currentEl))) ||
        first
    ) {
        if (currentEl.firstElementChild) currentEl = currentEl.firstElementChild
        else {
            while (!currentEl.nextElementSibling && currentEl)
                currentEl = currentEl.parentElement
            if (currentEl) currentEl = currentEl.nextElementSibling
            else return
        }
        first = false
    }
    if (currentEl) {
        // @ts-ignore
        currentEl.focus()
        return true
    }
    return false
}

export function fetchAPI(
    method: string,
    body: any,
    ...props: string[]
): Promise<commonApi> {
    return fetch(createURL('api', ...props), {
        method: method,
        ...(!DEV_MODE && { credentials: 'include' }),
        headers: {
            'Content-Type': 'application/json',
            verify: window.localStorage.tokenId,
        },
        ...(method !== 'GET' && { body: JSON.stringify(body) }),
    }).then((res) => res.json())
}

export function uploadFile(body: any) {
    return fetch(createURL('api', 'files', 'upload'), {
        method: 'POST',
        ...(!DEV_MODE && { credentials: 'include' }),
        body: body,
    }).then((res) => res.json())
}

export function RequireSudo() {
    setTimeout(async () => {
        const accountInfo = await fetchAPI('GET', {}, 'account', 'info')
        if (!accountInfo.data.sudo) {
            window.location.replace(
                createURL('account', 'challenge') +
                    '?next=' +
                    btoa(window.location.href)
            )
        }
    }, 0)
    return <></>
}

export function CardLink(props: {
    img: string
    title: string
    subtitle: string
    link?: string
}) {
    return (
        <Card style={{ margin: '10px' }}>
            <Link to={props.link}>
                <CardPrimaryAction>
                    <CardMedia
                        style={{
                            backgroundImage: `url(${props.img})`,
                            height: '220px',
                        }}
                        className='illust'
                    />
                    <div style={{ padding: '0 1rem 1rem 1rem' }}>
                        <Typography use='headline6' tag='h2'>
                            {props.title}
                        </Typography>
                        <Typography
                            use='body1'
                            tag='div'
                            theme='textSecondaryOnBackground'>
                            {props.subtitle}
                        </Typography>
                    </div>
                </CardPrimaryAction>
            </Link>
            {props.link && (
                <CardActions style={{ marginTop: 'auto' }}>
                    <CardActionButtons>
                        <Link to={props.link}>
                            <CardActionButton>열기</CardActionButton>
                        </Link>
                    </CardActionButtons>
                </CardActions>
            )}
        </Card>
    )
}

export function SearchUser<
    T extends {
        label?: string
        onKeyDown?: any
        onSelect?: any
        type?: [Permission]
    }
>(props: T) {
    const [query, setQuery] = useState('')
    const [menu, setMenu] = useState(false)
    const [data, setData] = useState([])
    const [sel, setSel] = useState({ name: '', uid: 0 })
    const searchTextbox = React.useRef(
        null
    ) as React.RefObject<HTMLInputElement>

    const { label, onKeyDown, onSelect, type, ...others } = {
        label: '검색',
        onKeyDown: () => {},
        onSelect: () => {},
        type: [Permission.student, Permission.teacher],
        ...props,
    }

    const refreshData = (q: string) => {
        fetchAPI('POST', { name: q, type: type }, 'account', 'search').then(
            (res) => {
                if (res.data && res.data.length) setData(res.data)
            }
        )
    }

    return (
        <MenuSurfaceAnchor>
            <Menu
                open={menu}
                onClose={() => {
                    setMenu(false)
                }}>
                <TextField
                    label='검색'
                    ref={searchTextbox}
                    style={{
                        width: '100%',
                        marginTop: '-8px',
                        marginBottom: '8px',
                    }}
                    value={query}
                    onChange={(e) => {
                        setQuery((e.target as HTMLInputElement).value)
                        refreshData((e.target as HTMLInputElement).value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') focusNextInput()
                        onKeyDown(e)
                    }}
                />
                {query ? (
                    data.length > 0 ? (
                        data.map((user) => {
                            return (
                                <MenuItem
                                    onClick={() => {
                                        onSelect({
                                            name: user.name,
                                            uid: user.uid,
                                        })
                                        setSel({
                                            name: user.name,
                                            uid: user.uid,
                                        })
                                        setMenu(false)
                                    }}>
                                    <div
                                        style={{ margin: '10px 10px 5px 0px' }}>
                                        <UserImage
                                            url={
                                                createURL(
                                                    'api',
                                                    'account',
                                                    'avatar',
                                                    user.uid
                                                ) +
                                                '?verify=' +
                                                window.localStorage.tokenId
                                            }
                                            size={30}
                                        />
                                    </div>
                                    {user.name}
                                </MenuItem>
                            )
                        })
                    ) : (
                        <Typography use='subtitle1' style={{ margin: '10px' }}>
                            검색 결과가 없어요!
                        </Typography>
                    )
                ) : (
                    <Typography use='subtitle1' style={{ margin: '10px' }}>
                        검색할 사람의 이름을 입력하세요.
                    </Typography>
                )}
            </Menu>
            <TextField
                style={{ width: '100%', height: '100%' }}
                outlined
                label={label}
                value={sel.name}
                onFocus={() => {
                    setMenu(true)
                    setTimeout(() => {
                        searchTextbox.current.focus()
                    }, 300)
                }}
            />
        </MenuSurfaceAnchor>
    )
}

export function TimeSelect<
    T extends {
        label?: string
        onKeyDown?: any
        onSelect?: any
        preset?: TimeRange[]
    }
>(props: T) {
    const [menu, setMenu] = useState(false)
    const [bh, setBH] = useState('')
    const [bm, setBM] = useState('')
    const [eh, setEH] = useState('')
    const [em, setEM] = useState('')

    const [title, setTitle] = useState('')
    const [sel, setSel] = useState({} as TimeRange)

    const beginHour = React.useRef(null) as React.RefObject<HTMLInputElement>
    const beginMinute = React.useRef(null) as React.RefObject<HTMLInputElement>
    const endHour = React.useRef(null) as React.RefObject<HTMLInputElement>
    const endMinute = React.useRef(null) as React.RefObject<HTMLInputElement>

    const { label, onKeyDown, onSelect, preset, ...others } = {
        label: '시간 설정',
        onKeyDown: () => {},
        onSelect: () => {},
        preset: new Array<TimeRange>(),
        ...props,
    }

    const updateTime = () => {
        setTimeout(() => {
            if (bh && bm && eh && em) {
                if (
                    sel.begin === getToday(parseInt(bh), parseInt(bm)) &&
                    sel.end === getToday(parseInt(eh), parseInt(em))
                )
                    return
                setSel(
                    timeRange(
                        getToday(parseInt(bh), parseInt(bm)),
                        getToday(parseInt(eh), parseInt(em)),
                        undefined
                    )
                )
                onSelect(
                    timeRange(
                        getToday(parseInt(bh), parseInt(bm)),
                        getToday(parseInt(eh), parseInt(em)),
                        undefined
                    )
                )
                setTitle(
                    formatTime(parseInt(bh), parseInt(bm)) +
                        ' - ' +
                        formatTime(parseInt(eh), parseInt(em))
                )
            }
        }, 100)
    }

    useEffect(() => {
        updateTime()
    }, [bh, bm, eh, em])

    return (
        <MenuSurfaceAnchor>
            <Menu
                style={{ minWidth: '300px' }}
                open={menu}
                onClose={() => {
                    setMenu(false)
                }}>
                <TextField
                    label='시'
                    style={{
                        width: '16.66%',
                        marginTop: '-8px',
                        marginBottom: '8px',
                    }}
                    value={bh}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        let raw = e.target.value.replace(/\D/g, '')
                        const num = parseInt(raw)
                        if (!num && num !== 0) setBH('')
                        else {
                            if (num > 23) raw = raw[0]
                            else if (num > 3 || !num)
                                beginMinute.current.focus()
                            setBH(raw)
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.which === 9) {
                            e.preventDefault()
                            e.stopPropagation()
                            beginMinute.current.focus()
                        }
                    }}
                    ref={beginHour}
                />
                <span
                    style={{
                        width: '8.33%',
                        textAlign: 'center',
                        display: 'inline-block',
                    }}>
                    :
                </span>
                <TextField
                    label='분'
                    style={{
                        width: '16.66%',
                        marginTop: '-8px',
                        marginBottom: '8px',
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        let raw = e.target.value.replace(/\D/g, '')
                        const num = parseInt(raw)
                        if (!num && num !== 0) setBM('')
                        else {
                            if (num > 59) raw = raw[0]
                            else if (num > 6 || !num) endHour.current.focus()
                            setBM(raw)
                        }
                    }}
                    value={bm}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.which === 9) {
                            e.preventDefault()
                            e.stopPropagation()
                            endHour.current.focus()
                        }
                    }}
                    ref={beginMinute}
                />
                <span
                    style={{
                        width: '16.66%',
                        textAlign: 'center',
                        display: 'inline-block',
                    }}>
                    -
                </span>
                <TextField
                    label='시'
                    style={{
                        width: '16.66%',
                        marginTop: '-8px',
                        marginBottom: '8px',
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        let raw = e.target.value.replace(/\D/g, '')
                        const num = parseInt(raw)
                        if (!num && num !== 0) setEH('')
                        else {
                            if (num > 23) raw = raw[0]
                            else if (num > 3 || !num) endMinute.current.focus()
                            setEH(raw)
                        }
                    }}
                    value={eh}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.which === 9) {
                            e.preventDefault()
                            e.stopPropagation()
                            endMinute.current.focus()
                        }
                    }}
                    ref={endHour}
                />
                <span
                    style={{
                        width: '8.33%',
                        textAlign: 'center',
                        display: 'inline-block',
                    }}>
                    :
                </span>
                <TextField
                    label='분'
                    style={{
                        width: '16.66%',
                        marginTop: '-8px',
                        marginBottom: '8px',
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        let raw = e.target.value.replace(/\D/g, '')
                        const num = parseInt(raw)
                        if (!num && num !== 0) setEM('')
                        else {
                            if (num > 23) raw = raw[0]
                            setEM(raw)
                        }
                    }}
                    value={em}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.which === 9) {
                            e.preventDefault()
                            e.stopPropagation()
                            setMenu(false)
                        }
                    }}
                    ref={endMinute}
                />
                {preset.map((time) => {
                    return (
                        <MenuItem
                            onClick={() => {
                                onSelect(time)
                                setBH(
                                    new Date(time.begin).getHours().toString()
                                )
                                setBM(
                                    new Date(time.begin).getMinutes().toString()
                                )
                                setEH(new Date(time.end).getHours().toString())
                                setEM(
                                    new Date(time.end).getMinutes().toString()
                                )
                                setSel(time)
                                setTitle(
                                    time.nickname ??
                                        formatTime(parseInt(bh), parseInt(bm)) +
                                            ' - ' +
                                            formatTime(
                                                parseInt(eh),
                                                parseInt(em)
                                            )
                                )
                                setMenu(false)
                            }}>
                            {time.nickname}
                        </MenuItem>
                    )
                })}
            </Menu>
            <TextField
                style={{ width: '100%', height: '100%' }}
                outlined
                label={label}
                value={title}
                onFocus={() => {
                    setMenu(true)
                    setTimeout(() => {
                        beginHour.current.focus()
                    }, 300)
                }}
                onClick={() => {
                    setMenu(true)
                    setTimeout(() => {
                        beginHour.current.focus()
                    }, 300)
                }}
            />
        </MenuSurfaceAnchor>
    )
}

export function UserImage(props: { url: string; size: number }) {
    return (
        <span
            title='Avatar'
            className='rmwc-icon rmwc-icon--component material-icons rmwc-avatar rmwc-avatar--xlarge rmwc-avatar--has-image'>
            <div
                className='rmwc-avatar__icon'
                style={{
                    backgroundImage: `url("${props.url}")`,
                    backgroundSize: 'cover',
                    width: `${props.size}px`,
                    height: `${props.size}px`,
                    borderRadius: '50%',
                }}
            />
        </span>
    )
}

export function isDarkTheme() {
    if (!localStorage.theme || localStorage.theme === '0') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches)
            return true
        else return false
    }
    if (localStorage.theme === '1') return false
    return true
}
