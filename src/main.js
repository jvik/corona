import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import axios from "axios";
import VueApexCharts from "vue-apexcharts";

Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);
new Vue({
  render: h => h(App)
}).$mount("#app");
