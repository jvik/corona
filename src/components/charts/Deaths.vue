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
  components: {
    VueApexCharts,
  },
  props: ['series'],
  data() {
    return {
      chartOptions: {
        chart: {
          height: '200px',
          id: 'confirmed',
        },
        xaxis: {
          categories: ['Death count'],
          labels: {
            show: false,
          },
          title: {
            text: 'Confirmed deaths',
            offsetX: 0,
            offsetY: 0,
            style: {
              color: undefined,
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-xaxis-title',
            },
          },
        },
      },
    }
  },
}
</script>

<style lang="scss" scoped></style>
