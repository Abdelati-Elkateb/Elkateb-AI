import {createRouter, createWebHiostory} from 'vue-router'


const route = createRouter({
    history: createWebHiostory(),
    routes:[
        {
            path:'/',
            name:'home',
            component:()=>import('../views/Home.vue')
        }
    ]
})

export default route;