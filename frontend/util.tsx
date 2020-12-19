import {Link} from "react-router-dom";
import {ListItem} from "@rmwc/list";
import * as React from "react";
import {useState} from "react";

export function ListLink(props: { body: string, to: string }) {
    return <Link style={{textDecoration: 'none'}} to={props.to}><ListItem
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


export function useForceUpdate(){
    const [value, setValue] = useState(0)
    return () => setValue(value => ++value)
}
