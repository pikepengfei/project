const menu = [
        {
            name: "home",
            path: "/",
            component: () =>
                import ( /* webpackChunkName: "layout" */ '@/views'),
        } 
    ]
export default menu