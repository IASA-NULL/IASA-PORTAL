import pagesConfig from './frontend/config'
import { Permission } from './scheme/api/auth'

export function pages() {
    let router = ['', '', '', '', '', '']
    let drawer = ['', '', '', '', '', '']
    for (let i of pagesConfig) {
        if (!i.child) {
            if (!i.showOnDrawer) continue
            for (let j of i.target)
                drawer[j] += `<ListLink 
                                    body='${i.name}' 
                                    to='${i.path}' 
                                    onClick={closeIfModal} 
                                    type={LinkType.link} 
                                    icon='${i.icon}' />`
        } else {
            for (let j of i.target) {
                drawer[j] += `<CollapsibleList
                defaultOpen={['/update', '/external', '/server'].includes(
                    window.location.pathname
                )}
                handle={
                    <SimpleListItem
                        text='${i.name}'
                        graphic='${i.icon}'
                        metaIcon='chevron_right'
                    />
                }>
                <div style={{ paddingLeft: '20px' }}>`
                for (let k of i.child) {
                    drawer[j] += `<ListLink 
                                    body='${k.name}' 
                                    to='${k.path}' 
                                    onClick={closeIfModal} 
                                    type={LinkType.link} 
                                    icon='${k.icon}' />`
                }
                drawer[j] += `</div></CollapsibleList>`
            }
        }
    }
    return { drawer }
}
