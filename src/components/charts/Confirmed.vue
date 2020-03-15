<template>
  <div>
    <v-card>
      <VueApexCharts
        type="bar"
        :options="chartOptions"
        :series="series"
      ></VueApexCharts>
    </v-card>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
  props: ['series'],
  components: {
    VueApexCharts,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          height: '200px',
          id: 'confirmed',
        },
        xaxis: {
          categories: ['Confirmed infected'],
        },
      },
    }
  },
}
</script>

<style lang="scss" scoped></style>
