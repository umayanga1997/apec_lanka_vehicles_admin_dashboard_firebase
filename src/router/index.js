import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Helps from '@/views/apps_manage_screens/help_screen.vue';
import Ads from '@/views/apps_manage_screens/Ads/ads_screen.vue';
import SpecialNotes from '@/views/apps_manage_screens/special_notes_screen.vue';
import AdditionalPackages from '@/views/apps_manage_screens/additional_packages_screen.vue';
import WhatIsNew from '@/views/apps_manage_screens/whatIs_new_screen.vue';
import Introductions from '@/views/apps_manage_screens/introduction_screen.vue';
import AboutUs from '@/views/apps_manage_screens/aboutUs_screen.vue';
import OurProducts from '@/views/apps_manage_screens/our_products_screen.vue';
import OtherConfigs from '@/views/apps_manage_screens/other_config_screen.vue';
import Locations from '@/views/find_screens/locations_screen.vue';

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
        path: '/ads_conf_',
        name: 'ads',
        component: Ads,
    },
    {
        path: '/special_notes_',
        name: 'special_notes',
        component: SpecialNotes,
    },
    {
        path: '/additional_packages_',
        name: 'additional_packages',
        component: AdditionalPackages,
    },
    {
        path: '/what_is_new_details_',
        name: 'what_is_new_details',
        component: WhatIsNew,
    },
    {
        path: '/instructions_',
        name: 'instructions',
        component: Introductions,
    },
    {
        path: '/about_us_details_',
        name: 'about_us',
        component: AboutUs,
    },
    {
        path: '/our_products_',
        name: 'our_products',
        component: OurProducts,
    },
    {
        path: '/other_config_',
        name: 'other_config',
        component: OtherConfigs,
    },
    {
        path: '/locations_',
        name: 'locations',
        component: Locations,
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router