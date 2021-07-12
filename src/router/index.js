import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Helps from '@/views/apps_manage_screens/help_screen.vue';
import Ads from '@/views/apps_manage_screens/Ads/ads_screen.vue';

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/helps_',
        name: 'helps',
        component: Helps,
    },
    {
        path: '/ads_conf',
        name: 'ads',
        component: Ads,
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router