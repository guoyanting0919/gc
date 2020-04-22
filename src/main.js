import Vue from 'vue';
import App from './App.vue';
import Blob from './Excel/Blob';
import Export2Excel from './Excel/Export2Excel.js';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { Datetime } from 'vue-datetime';
import GAuth from 'vue-google-oauth2';

// You need a specific loader for CSS files
import 'vue-datetime/dist/vue-datetime.css';

const gauthOption = {
  clientId:
    '287730103958-vqnr9k4vs3o2lfno9s63r16jacnaf0k0.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/calendar.events',
  prompt: 'consent',
};
Vue.use(GAuth, gauthOption);

Vue.use(Datetime);

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
