<template>
  <div>
    <v-card>
      <VueApexCharts
        type="line"
        :options="chartOptions"
        :series="timeSeriesData"
      ></VueApexCharts>
    </v-card>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
export default {
  props: ['timeseries'],
  components: {
    VueApexCharts,
  },
  computed: {
    timeSeriesData() {
      const myArray = []
      for (const key of Object.keys(this.timeseries)) {
        const val = this.timeseries[key]
        myArray.push(val)
      }

      const dataStructure = [{ name: 'Timeseries', data: myArray }]

      return dataStructure
    },
    timeSeriesDates() {
      const myArray = []
      for (const key of Object.keys(this.timeseries)) {
        myArray.push(key)
      }
      return myArray
    },
    chartOptions() {
      const options = {
        chart: {
          type: 'line',
          id: 'Deaths',
        },
        xaxis: {
          type: 'datetime',
          categories: this.timeSeriesDates,
        },
      }
      return options
    },
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped></style>
