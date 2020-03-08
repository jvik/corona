<template>
  <div class="hello">
    <h1 class="mt-4">{{ msg }}</h1>
    <v-overlay v-model="autoLoading">
      <v-progress-circular indeterminate size="100"></v-progress-circular>
    </v-overlay>
    <div class="my-2">
      <v-row class="px-10">
        <v-col cols="12" class="d-flex">
          <v-select
            :items="apiList"
            label="Velg datakilde"
            item-text="label"
            return-object
            multiple
            chips
            v-model="selectedAPIs"
            @change="init(selectedAPIs)"
          ></v-select>
        </v-col>
        <v-col class="mt-0 pt-0" md="6">
          <v-switch
            class="mt-0 pt-0"
            hint="Hvert femte minutt"
            persistent-hint
            v-model="autoReloadingEnabled"
            label="Auto oppdater"
          ></v-switch>
        </v-col>
        <v-col class="mt-0 pt-0" align="right">
          <v-btn @click="init(selectedAPIs)" color="dark-grey" fab dark>
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="white"
            ></v-progress-circular>
            <v-icon v-if="!loading">mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="px-10">
        <v-col>
          <apexchart
            type="bar"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "Corona",
  props: {
    msg: String
  },
  computed: {
    series: function() {
      return this.responseData.series;
    }
  },
  data() {
    return {
      loading: false,
      autoLoading: false,
      autoReloadingEnabled: true,
      confirmed: 0,
      deaths: 0,
      recovered: 0,
      apiList: [
        {
          name: "arcgis",
          label: "arcgis.com",
          url:
            "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/2/query?f=json&where=Confirmed%20%3E%200&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc&resultOffset=0&resultRecordCount=100&cacheHint=true",
          path: "data.features[15].attributes.",
          confirmed: "Confirmed",
          deaths: "Deaths"
        },
        {
          name: "isaaclin",
          label: "lab.isaaclin.cn",
          url: "https://lab.isaaclin.cn/nCoV/api/area?latest=1&province=挪威",
          path: "data.results[0]",
          confirmed: "confirmedCount",
          deaths: "deadCount"
        }
      ],
      responseData: {
        series: []
      },
      selectedAPIs: [],
      chartOptions: {
        chart: {
          height: "200px",
          id: "vuechart-example"
        },
        xaxis: {
          categories: ["Bekreftet smittet", "Dødsfall"]
        }
      }
    };
  },
  created() {
    const delay = 300000;
    if (this.autoReloadingEnabled) {
      setInterval(
        function() {
          this.request(this.selectedAPIs);
          this.autoLoading = true;
        }.bind(this),
        delay
      );
    }
  },
  methods: {
    init(selectedAPIs) {
      this.loading = true;
      this.request(selectedAPIs);
    },
    request(selectedAPIs) {
      for (const selectedAPI of selectedAPIs) {
        if (this.selectedAPIs.length !== this.responseData.series.length) {
          this.responseData.series = this.responseData.series.filter(object => {
            object.name === selectedAPI.name;
          });
        }
        this.$http
          .get(selectedAPI.url)
          .then(response => {
            if (response && response.status === 200) {
              setTimeout(() => {
                this.loading = false;
                this.autoLoading = false;
              }, 1000);

              const data = {
                name: selectedAPI.name,
                data: [
                  parseInt(
                    _.get(response, selectedAPI.path + selectedAPI.confirmed)
                  ),
                  parseInt(
                    _.get(response, selectedAPI.path + selectedAPI.deaths)
                  )
                ]
              };

              let dataAlreadyAvailable = this.responseData.series.find(
                object => object.name === selectedAPI.name
              );

              if (dataAlreadyAvailable) {
                dataAlreadyAvailable = data;
              } else {
                this.responseData.series.push(data);
              }
            }
          })
          .catch();
      }
    }
  },
  mounted() {
    this.selectedAPIs = this.apiList;
    this.init(this.selectedAPIs);
  }
};
</script>

<style scoped>
.container {
  margin: auto;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
