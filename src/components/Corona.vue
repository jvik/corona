<template>
  <div class="hello">
    <h1 class="mt-4">{{ msg }}</h1>
    <v-overlay v-model="autoLoading">
      <v-progress-circular indeterminate size="100"></v-progress-circular>
    </v-overlay>
    <div class="my-2">
      <v-row justify="space-between" class="px-10">
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
      <v-row justify="space-between" class="px-10">
        <v-col cols="auto" sm="6" md="6">
          <Confirmed :series="confirmedSeries" />
        </v-col>
        <!-- <v-col cols="auto" sm="6" md="4"><Deaths :series="deathSeries"/></v-col> -->
        <v-col cols="auto" sm="6" md="6w">
          <TimeSeries :timeseries="responseData.timeseries.new.confirmed" />
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
import axios from 'axios'
import TimeSeries from './charts/TimeSeries'
import Confirmed from './charts/Confirmed'
// import Deaths from './charts/Deaths'

export default {
  name: 'Corona',
  components: {
    TimeSeries,
    Confirmed,
    // Deaths,
  },
  props: {
    msg: String,
  },
  computed: {
    deathSeries() {
      const myArray = [{ data: [this.deaths], name: 'vg' }]

      return myArray
    },
    confirmedSeries() {
      const myArray = [
        { data: [this.responseData.totals.confirmed], name: 'vg' },
      ]

      return myArray
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
      responseData: {
        timeseries: {
          total: {
            confirmed: {},
          },
        },
        totals: {
          confirmed: 0,
        },
      },
      selectedAPIs: [],
      timeseries: {},
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
      // axios
      //   .get(
      //     'url: "https://lab.isaaclin.cn/nCoV/api/area?latest=1&province=挪威"'
      //   )
      //   .then(response => {
      //     console.log(response)
      //   })
      // Remove stats that are not selected
      axios
        .get(
          'https://redutv-api.vg.no/corona/v1/sheets/norway-table-overview/?region=county'
        )
        .then(response => {
          if (response && response.status === 200) {
            this.deaths = response.data.totals.dead
          }
        })

      axios
        .get('https://www.vg.no/spesial/2020/corona-viruset/data/norway/')
        .then(response => {
          if (response && response.status === 200) {
            setTimeout(() => {
              this.loading = false
              this.autoLoading = false
              var newDate = new Date(Date.now())
              this.latestUpdate = newDate.toLocaleTimeString()
            }, 1000)

            this.responseData = response.data
          }
        })
        .catch(() => {
          this.request()
        })
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
