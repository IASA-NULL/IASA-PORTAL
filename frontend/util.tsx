import {Link} from "react-router-dom";
import {ListItem} from "@rmwc/list";
import * as React from "react";
import {useState} from "react";

const {AnchorLink} = require('react-anchor-link-smooth-scroll')

export function ListLink(props: { body: string, to: string, onClick?: any, type?: number }) {
    if (props.type === 1) return <a style={{textDecoration: 'none'}} href={props.to} onClick={props.onClick}><ListItem
        activated={props.to === location.pathname}>{props.body}</ListItem></a>
    else if (props.type === 2) {
        return <ListItem onClick={() => {
            // @ts-ignore
            scrollObj.scroll({el: document.getElementById(props.to), margin: 80}, 500)
            props.onClick()
        }} activated={props.to === location.pathname}>{props.body}</ListItem>
    } else return <Link style={{textDecoration: 'none'}} to={props.to} onClick={props.onClick}><ListItem
        activated={props.to === location.pathname}>{props.body}</ListItem></Link>
}

export function LoremIpsum(props: { count: number }) {
    return <>
        {new Array(props.count).fill(<p>Lorem ipsum odor amet, consectetuer adipiscing elit. Ac purus in massa egestas
            mollis varius; dignissim elementum. Mollis tincidunt mattis hendrerit dolor eros enim, nisi ligula ornare.
            Hendrerit parturient habitant pharetra rutrum gravida porttitor eros feugiat. Mollis elit sodales taciti
            duis praesent id. Consequat urna vitae morbi nunc congue.</p>)}
    </>
}


export function useForceUpdate() {
    const [value, setValue] = useState(0)
    return () => setValue(value => ++value)
}
