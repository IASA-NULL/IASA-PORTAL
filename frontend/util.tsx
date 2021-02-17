import {Link} from 'react-router-dom'
import {ListItem, ListItemText, ListItemGraphic, ListDivider} from '@rmwc/list'
import * as React from 'react'
import {LegacyRef, useState} from 'react'
import {Menu, MenuItem, MenuSurfaceAnchor} from '@rmwc/menu'
import {TextField} from '@rmwc/textfield'
import createURL from '../scheme/url'
import {Typography} from "@rmwc/typography";
import {Button} from "@rmwc/button";
import {currentTeacherList} from "../scheme/teacher/teacher";
import set = Reflect.set;
import {Permission} from "../scheme/api/auth";

declare const DEV_MODE: boolean

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
                    {props.icon ? <ListItemGraphic icon={props.icon}/> : <></>}
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
                        {el: document.getElementById(props.to), margin: 80},
                        500
                    )
                    props.onClick()
                }}
                activated={props.to === window.location.pathname}>
                {props.icon ? <ListItemGraphic icon={props.icon}/> : <></>}
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
                    {props.icon ? <ListItemGraphic icon={props.icon}/> : <></>}
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
                        {el: document.getElementById(props.to), margin: 80},
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

export function LoremIpsum(props: { count: number }) {
    return (
        <>
            {new Array(props.count).fill(
                <p>
                    Lorem ipsum odor amet, consectetuer adipiscing elit. Ac
                    purus in massa egestas mollis varius; dignissim elementum.
                    Mollis tincidunt mattis hendrerit dolor eros enim, nisi
                    ligula ornare. Hendrerit parturient habitant pharetra rutrum
                    gravida porttitor eros feugiat. Mollis elit sodales taciti
                    duis praesent id. Consequat urna vitae morbi nunc congue.
                </p>
            )}
        </>
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
                style={{display: 'none'}}
                type='file'
                onChange={(e) => {
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
    if (window.innerWidth <= 760) return <br/>
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

export function fetchAPI(method: string, body: any, ...props: string[]) {
    return fetch(createURL('api', ...props), {
        method: method,
        ...(!DEV_MODE && {credentials: 'include'}),
        headers: {
            'Content-Type': 'application/json',
        },
        ...(method !== 'GET' && {body: JSON.stringify(body)}),
    }).then((res) => res.json())
}

export function requireSudo() {
    setTimeout(async () => {
        const accountInfo = await fetchAPI('GET', {}, 'account', 'info')
        if (!accountInfo.data.sudo) {
            window.location.replace(
                createURL('account', 'challenge') +
                '?next=' + btoa(window.location.href)
            )
        }
    }, 0)
}

export function SearchUser<T extends { label?: string, onKeyDown?: any, onSelect?: any, type?: [Permission] }>(props: T) {
    const [query, setQuery] = useState("")
    const [menu, setMenu] = useState(false)
    const [data, setData] = useState([])
    const [sel, setSel] = useState({name: "", uid: 0})
    const searchTextbox = React.useRef(null) as React.RefObject<HTMLInputElement>

    const {label, onKeyDown, onSelect, type, ...others} = {
        label: "검색",
        onKeyDown: () => {
        },
        onSelect: () => {
        },
        type: [Permission.student, Permission.teacher],
        ...props
    }

    const refreshData = (q: string) => {
        fetchAPI('POST', {name: q, type: type}, 'account', 'search').then((res) => {
            if (res.data && res.data.length) setData(res.data)
        })
    }

    return <MenuSurfaceAnchor>
        <Menu
            open={menu}
            onClose={(e) => {
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
            {query ? (data.length > 0 ? data.map((user) => {
                    return <MenuItem
                        onClick={() => {
                            onSelect({name: user.name, uid: user.uid})
                            setSel({name: user.name, uid: user.uid})
                            setMenu(false)
                        }}>
                        {user.name}
                    </MenuItem>
                }) : <Typography use='subtitle1'
                                 style={{margin: '10px'}}>검색 결과가 없어요!</Typography>) :
                <Typography use='subtitle1' style={{margin: '10px'}}>검색할 사람의 이름/학번을 입력하세요.</Typography>}
        </Menu>
        <TextField
            style={{width: '100%', height: '100%'}}
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
}