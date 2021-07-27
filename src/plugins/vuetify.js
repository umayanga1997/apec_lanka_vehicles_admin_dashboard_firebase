import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import Vuesax from 'vuesax';
import 'vuesax/dist/vuesax.css'; //Vuesax styles

Vue.use(Vuetify);
Vue.use(Vuesax, {
    // options here
    colors: {
        primary: '#5b3cc4',
        success: 'rgb(23, 201, 100)',
        danger: 'rgb(242, 19, 93)',
        warning: 'rgb(255, 130, 0)',
        dark: 'rgb(36, 33, 69)'
    }
});

export default new Vuetify({
    icons: {
        iconfont: 'md'
    }
});