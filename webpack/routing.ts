import { Permission } from '../scheme/api/auth'

interface Routing {
    file?: string
    path?: string
    target?: Permission[]
    icon: string
    name: string
    showOnDrawer?: boolean
    child?: Routing[]
    customNav?: string
}

const Permission_all_auth = [
    Permission.admin,
    Permission.teacher,
    Permission.student,
]

const Permission_any = [
    Permission.admin,
    Permission.teacher,
    Permission.student,
    Permission.none,
]

export default [
    {
        file: 'student/main.tsx',
        path: '/',
        target: [Permission.student],
        icon: 'home',
        name: '메인',
        showOnDrawer: true,
    },
    {
        file: 'teacher/main.tsx',
        path: '/',
        target: [Permission.teacher],
        icon: 'home',
        name: '메인',
        showOnDrawer: true,
    },
    {
        file: 'admin/main.tsx',
        path: '/',
        target: [Permission.admin],
        icon: 'home',
        name: '메인',
        showOnDrawer: true,
    },
    {
        file: 'common/share.tsx',
        path: '/share',
        target: Permission_any,
        icon: 'share',
        name: '빠른 공유',
        showOnDrawer: true,
    },
    {
        file: 'common/mail.tsx',
        path: '/mail',
        target: Permission_all_auth,
        icon: 'mail',
        name: '메일',
        showOnDrawer: true,
    },
    {
        file: 'student/classroom.tsx',
        path: '/classroom',
        target: [Permission.student],
        icon: 'class',
        name: '과제',
        showOnDrawer: true,
    },
    {
        target: [Permission.admin],
        icon: 'settings',
        name: '사이트 관리',
        child: [
            {
                file: 'admin/update.tsx',
                path: '/update',
                icon: 'system_update',
                name: '업데이트',
            },
            {
                file: 'admin/external.tsx',
                path: '/external',
                icon: 'cloud',
                name: '서비스 관리',
            },
            {
                file: 'admin/server.tsx',
                path: '/server',
                icon: 'dns',
                name: '인스턴스 관리',
            },
        ],
    },
    {
        target: [Permission.teacher],
        icon: 'auto_fix_normal',
        name: '학생 지도',
        child: [
            {
                file: 'teacher/myeonbul.tsx',
                path: '/myeonbul',
                icon: 'pan_tool',
                name: '면불',
            },
            {
                file: 'teacher/penalty.tsx',
                path: '/penalty',
                icon: 'assignment_late',
                name: '상벌점',
            },
        ],
    },
    {
        target: [Permission.admin],
        icon: 'account_circle',
        name: '사용자 관리',
        child: [
            {
                file: 'admin/createcode.tsx',
                path: '/user/code',
                icon: 'system_update',
                name: '가입 코드 발급',
            },
            {
                file: 'admin/api.tsx',
                path: '/createapi',
                icon: 'api',
                name: 'API 계정 관리',
            },
            {
                file: 'admin/assign.tsx',
                path: '/assign',
                icon: 'school',
                name: '반 배정',
            },
            {
                file: 'admin/club.tsx',
                path: '/club',
                icon: 'groups',
                name: '동아리 개설',
            },
            {
                file: 'admin/clubUser.tsx',
                path: '/clubUser',
                icon: 'account_box',
                name: '동아리 신청인원 관리',
            },
        ],
    },
    {
        target: [Permission.student],
        icon: 'playlist_add_check',
        name: '신청',
        child: [
            {
                file: 'student/myeonbul.tsx',
                path: '/myeonbul',
                icon: 'pan_tool',
                name: '면불',
            },
            {
                file: 'student/music.tsx',
                path: '/music',
                icon: 'music_note',
                name: '기상곡',
            },
        ],
    },
    {
        target: [Permission.student],
        icon: 'night_shelter',
        name: '생활',
        child: [
            {
                file: 'student/penalty.tsx',
                path: '/penalty',
                icon: 'assignment_late',
                name: '상벌점',
            },
        ],
    },
    {
        target: [Permission.teacher],
        file: 'teacher/print.tsx',
        path: '/print',
        icon: 'music_note',
        name: '프린터 명부',
        showOnDrawer: true,
    },
    {
        target: [Permission.teacher],
        file: 'teacher/busking.tsx',
        path: '/busking',
        icon: 'science',
        name: '버스킹 명부',
        showOnDrawer: true,
    },
    {
        target: Permission_any,
        file: 'common/meal.tsx',
        path: '/meal',
        icon: 'fastfood',
        name: '급식',
        showOnDrawer: true,
    },
    {
        target: Permission_any,
        file: 'common/record.tsx',
        path: '/record',
        icon: 'voice_chat',
        name: '화면 녹화',
        showOnDrawer: true,
    },
    {
        target: Permission_any,
        icon: 'folder',
        name: '프로그램',
        child: [
            {
                file: 'common/network.tsx',
                path: '/program/network',
                icon: 'wysiwyg',
                name: '인터넷 연결 도구',
            },
            {
                file: 'student/program/ip',
                path: '/program/ip',
                icon: 'wysiwyg',
                name: 'IP',
            },
            {
                file: 'common/404.tsx',
                path: '/program/client',
                icon: 'wysiwyg',
                name: 'IASA CLIENT',
            },
        ],
    },
    {
        target: Permission_all_auth,
        file: 'common/mypage.tsx',
        path: '/mypage',
    },
    {
        target: Permission_all_auth,
        file: 'common/notifications.tsx',
        path: '/notifications',
    },
    {
        target: Permission_any,
        file: 'common/terms.tsx',
        path: '/terms',
        customNav: 'TermsNavList',
    },
    {
        target: Permission_any,
        file: 'common/userdata.tsx',
        path: '/userdata',
        customNav: 'UserDataNavList',
    },
    {
        target: Permission_any,
        file: 'common/opensource.tsx',
        path: '/opensource',
        customNav: 'OpensourceNavList',
    },
    {
        target: Permission_any,
        file: 'openapi/desc.tsx',
        path: '/openapi/desc',
        customNav: 'OpenAPINavList',
    },
    {
        target: Permission_any,
        file: 'openapi/account.tsx',
        path: '/openapi/account',
        customNav: 'OpenAPINavList',
    },
    {
        target: Permission_any,
        file: 'openapi/meal.tsx',
        path: '/openapi/meal',
        customNav: 'OpenAPINavList',
    },
    {
        target: Permission_any,
        file: 'openapi/index.tsx',
        path: '/openapi',
        customNav: 'OpenAPINavList',
    },
] as Array<Routing>
