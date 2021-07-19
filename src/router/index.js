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
import VehiclesTypes from '@/views/find_screens/vehicles_types_screen.vue';
import AdminsAccounts from '@/views/Accounts/admins_accounts_screen.vue';
import OwnersAccounts from '@/views/Accounts/owners_accounts_screen.vue';
import UserTransactions from '@/views/Accounts/user_transactions_screen.vue';
import UserVehicles from '@/views/Accounts/user_vehicles_screen.vue';

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/app_manage/helps_',
        name: 'helps',
        component: Helps,
    },
    {
        path: '/app_manage/ads_conf_',
        name: 'ads',
        component: Ads,
    },
    {
        path: '/app_manage/special_notes_',
        name: 'special_notes',
        component: SpecialNotes,
    },
    {
        path: '/app_manage/additional_packages_',
        name: 'additional_packages',
        component: AdditionalPackages,
    },
    {
        path: '/app_manage/what_is_new_details_',
        name: 'what_is_new_details',
        component: WhatIsNew,
    },
    {
        path: '/app_manage/instructions_',
        name: 'instructions',
        component: Introductions,
    },
    {
        path: '/app_manage/about_us_details_',
        name: 'about_us',
        component: AboutUs,
    },
    {
        path: '/app_manage/our_products_',
        name: 'our_products',
        component: OurProducts,
    },
    {
        path: '/app_manage/other_config_',
        name: 'other_config',
        component: OtherConfigs,
    },
    {
        path: '/find_options/locations_',
        name: 'locations',
        component: Locations,
    },
    {
        path: '/find_options/vehicles_types_',
        name: 'vehicles_types',
        component: VehiclesTypes,
    },
    {
        path: '/accounts/admin_acc_',
        name: 'admins_accounts',
        component: AdminsAccounts,
    },
    {
        path: '/accounts/owners_acc_',
        name: 'owners_accounts',
        component: OwnersAccounts,
    },
    {
        path: '/accounts/owners_acc_/vehicles/:id',
        name: 'user_vehicles',
        component: UserVehicles,
        // props: true
    },
    {
        path: '/accounts/owners_acc_/transactions/:id',
        name: 'user_transactions',
        component: UserTransactions,
        // props: true
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router