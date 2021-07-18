import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        screenName: "Welcome"
    },
    getters: {

    },
    mutations: {
        changeScreenName: (state, payload) => {
            state.screenName = payload;
        }
    },
    actions: {},
    modules: {}
})