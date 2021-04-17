import pagesConfig from './frontend/config'
import { Permission } from './scheme/api/auth'

function getNavListName(type: Permission) {
    if (type === Permission.student) return 'DefaultStudentNavList'
    if (type === Permission.teacher) return 'DefaultTeacherNavList'
    if (type === Permission.admin) return 'DefaultAdminNavList'
}

export function pages() {
    let imports = ''
    let router = ['', '', '', '', '', '']
    let drawer = ['', '', '', '', '', '']
    for (let i of pagesConfig) {
        if (!i.child) {
            imports += `import Comp_${Buffer.from(i.file)
                .toString('base64')
                .replace(/=/g, '')} from './${i.file}'\n`
            for (let j of i.target) {
                if (i.showOnDrawer)
                    drawer[j] += `<ListLink 
                                    body='${i.name}' 
                                    to='${i.path}' 
                                    onClick={closeIfModal} 
                                    type={LinkType.link} 
                                    icon='${i.icon}' />`
                router[j] += `<Route path='${i.path}' ${
                    i.path === '/' ? 'exact' : ''
                }>
                        <MainView
                            accountInfo={this.state.data}
                            navList={${i.customNav || getNavListName(j)}}
                            appCont={<Comp_${Buffer.from(i.file)
                                .toString('base64')
                                .replace(/=/g, '')} data={this.state?.data} />}
                        />
                    </Route>`
            }
        } else {
            for (let k of i.child) {
                imports += `import Comp_${Buffer.from(k.file)
                    .toString('base64')
                    .replace(/=/g, '')} from './${k.file}'\n`
            }
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
                    router[j] += `<Route path='${k.path}'>
                        <MainView
                            accountInfo={this.state.data}
                            navList={${k.customNav || getNavListName(j)}}
                            appCont={<Comp_${Buffer.from(k.file)
                                .toString('base64')
                                .replace(/=/g, '')} data={this.state?.data} />}
                        />
                    </Route>`
                }
                drawer[j] += `</div></CollapsibleList>`
            }
        }
    }
    return { drawer, router, imports }
}
