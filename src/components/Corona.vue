<template>
  <div class="hello">
    <h1 class="mt-4">{{ msg }}</h1>
    <v-overlay v-model="autoLoading">
      <v-progress-circular indeterminate size="100"></v-progress-circular>
    </v-overlay>
    <div class="my-2">
      <v-row justify="space-between" class="px-10">
        <v-col cols="auto" xs="12" md="8">
          <!-- <v-select
            :disable="loading"
            :items="apiList"
            label="Select data source"
            item-text="label"
            return-object
            multiple
            chips
            v-model="selectedAPIs"
            @change="init()"
          ></v-select> -->
        </v-col>
        <v-col cols="auto" sm="6" md="2" class="mt-0 pt-0">
          <v-switch
            class="mt-0 pt-0"
            hint="Every 5 minutes"
            persistent-hint
            v-model="autoReloadingEnabled"
            label="Auto updated"
          ></v-switch>
        </v-col>
        <v-col cols="auto" sm="1" md="2" class="mt-0 pt-0" align="right">
          <v-btn
            small
            :loading="loading"
            @click="init()"
            color="dark-grey"
            fab
            dark
          >
            <v-icon v-if="!loading">mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="px-10">
        <v-col>
          <Confirmed :series="confirmedSeries" />
        </v-col>
        <v-col>
          <v-card>
            <VueApexCharts
              type="bar"
              :options="chartOptions2"
              :series="deathSeries"
            ></VueApexCharts>
          </v-card>
        </v-col>
        <v-col>
          <TimeSeries :timeseries="timeseries" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p>
            Data provided by
            <a href="http://vg.no" target="_blank" rel="noopener noreferrer"
              >vg.no</a
            >
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p>Last updated {{ latestUpdate }}</p>
          <a href="https://jvik.no">Made by jvik</a>
          | <a href="https://github.com/jvik/corona">github repo</a>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import VueApexCharts from 'vue-apexcharts'
import TimeSeries from './charts/TimeSeries'
import Confirmed from './charts/Confirmed'

export default {
  name: 'Corona',
  components: {
    VueApexCharts,
    TimeSeries,
    Confirmed,
  },
  props: {
    msg: String,
  },
  computed: {
    deathSeries: function() {
      function sortNumber(a, b) {
        return b.data[0] - a.data[0]
      }

      const unsorted = this.responseData.deathSeries
      const sorted = unsorted.sort(sortNumber)

      return sorted
    },
    confirmedSeries: function() {
      function sortNumber(a, b) {
        return b.data[0] - a.data[0]
      }

      const unsorted = this.responseData.confirmedSeries
      const sorted = unsorted.sort(sortNumber)

      return sorted
    },
  },
  data() {
    return {
      loading: false,
      autoLoading: false,
      autoReloadingEnabled: true,
      confirmed: 0,
      deaths: 0,
      recovered: 0,
      latestUpdate: null,
      apiList: [
        {
          name: 'vg',
          label: 'vg.no',
          url: 'https://www.vg.no/spesial/2020/corona-viruset/data/norway/',
          path: 'data.totals.',
          confirmed: 'confirmed',
          deaths: 'dead',
        },
        // {
        //   name: 'isaaclin',
        //   label: 'lab.isaaclin.cn',
        //   url: 'https://lab.isaaclin.cn/nCoV/api/area?latest=1&province=挪威',
        //   path: 'data.results[0]',
        //   confirmed: 'confirmedCount',
        //   deaths: 'deadCount',
        // },
      ],
      responseData: {
        confirmedSeries: [],
        deathSeries: [],
      },
      selectedAPIs: [],
      timeseries: {},

      chartOptions2: {
        chart: {
          height: '200px',
          id: 'confirmed',
        },
        xaxis: {
          categories: ['Death count'],
        },
      },
    }
  },
  created() {
    const delay = 300000
    if (this.autoReloadingEnabled) {
      setInterval(
        function() {
          this.request(this.selectedAPIs)
          this.autoLoading = true
        }.bind(this),
        delay
      )
    }
  },
  methods: {
    init() {
      this.loading = true
      this.request()
    },
    request() {
      // Remove stats that are not selected
      for (const selectedAPI of this.selectedAPIs) {
        if (
          this.selectedAPIs.length !== this.responseData.confirmedSeries.length
        ) {
          this.responseData.confirmedSeries = this.responseData.confirmedSeries.filter(
            object => {
              object.name === selectedAPI.name
            }
          )
          this.responseData.deathSeries = this.responseData.deathSeries.filter(
            object => {
              object.name === selectedAPI.name
            }
          )
        }
        axios
          .get(selectedAPI.url)
          .then(response => {
            if (response && response.status === 200) {
              setTimeout(() => {
                this.loading = false
                this.autoLoading = false
                var newDate = new Date(Date.now())
                this.latestUpdate = newDate.toLocaleTimeString()
              }, 1000)

              this.timeseries = response.data.timeseries.total.confirmed

              const confirmedBuilder = _.get(
                response,
                selectedAPI.path + selectedAPI.confirmed
              )
              const deathsBuilder = _.get(
                response,
                selectedAPI.path + selectedAPI.deaths
              )

              const deathData = {
                name: selectedAPI.name,
                data: [deathsBuilder],
              }

              const confirmedData = {
                name: selectedAPI.name,
                data: [confirmedBuilder],
              }

              let confirmedDataAlreadyAvailable = this.responseData.confirmedSeries.find(
                object => object.name === selectedAPI.name
              )
              let deathDataAlreadyAvailable = this.responseData.deathSeries.find(
                object => object.name === selectedAPI.name
              )

              // If data is already fetched, overwrite instead of pushing to data array
              if (confirmedDataAlreadyAvailable || deathDataAlreadyAvailable) {
                confirmedDataAlreadyAvailable = confirmedData
                deathDataAlreadyAvailable = deathData
              } else {
                this.responseData.confirmedSeries.push(confirmedData)
                this.responseData.deathSeries.push(deathData)
              }
            }
          })
          .catch(() => {
            this.request()
          })
      }
    },
  },
  mounted() {
    this.selectedAPIs = this.apiList
    this.init()
  },
}
</script>

<style scoped>
.container {
  margin: auto;
}
</style>
