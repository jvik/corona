import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import axios from "axios";
import VueApexCharts from "vue-apexcharts";
import vuetify from "./plugins/vuetify";

Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);
new Vue({
  vuetify,
  render: h => h(App)
}).$mount("#app");