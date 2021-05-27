export const roleConfig = {

    ADMIN: {
        dashboard: '/graphs',
        menus: [
            {name: 'users', path: '/users'},
            {name: 'graphs', path: '/graphs'}
        ]
    },
    
    SUPPORT: {
        dashboard: '/dashboard_support',
        menus: [
            {name: 'forum_support', path: '/forum_support'}
        ]
    },

    USER: {
        dashboard: '/dashboard',
        menus: [
            {name: 'transactions', path: '/transactions'},
            {name: 'login', path: '/login'},
            {name: 'forum', path: '/forum'},
            {name: 'register', path: '/register'},
            {name: 'payments', path: '/payments'},
            {name: 'sendMoney', path: '/sendMoney'}
        ]
    },

}