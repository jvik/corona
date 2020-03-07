<template>
  <div class="hello">
    <h1 class="mt-4">{{ msg }}</h1>
    <div class="my-2">
      <v-row class="px-10">
        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            :items="API"
            label="Velg datakilde"
            item-text="name"
            return-object
            v-model="selectedAPI"
            @change="init(selectedAPI)"
          ></v-select>
        </v-col>
        <v-col align="right">
          <v-btn @click="init(selectedAPI)" color="dark-grey" fab dark>
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
export default {
  name: "Corona",
  props: {
    msg: String
  },
  computed: {
    series: function() {
      return [
        {
          name: "smitte",
          data: [this.confirmed, this.deaths]
        }
      ];
    }
  },
  data() {
    return {
      loading: false,
      confirmed: 0,
      deaths: 0,
      recovered: 0,
      API: [
        {
          name: "arcgis.com",
          url:
            "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/2/query?f=json&where=Confirmed%20%3E%200&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc&resultOffset=0&resultRecordCount=100&cacheHint=true"
        },
        {
          name: "lab.isaaclin.cn",
          url: "https://lab.isaaclin.cn/nCoV/api/area?latest=1&province=挪威"
        }
      ],
      selectedAPI: {},
      chartOptions: {
        chart: {
          id: "vuechart-example"
        },
        xaxis: {
          categories: ["Bekreftet smittet", "Dødsfall"]
        }
      }
    };
  },
  methods: {
    init(api) {
      this.loading = true;

      this.$http.get(api.url).then(response => {
        setTimeout(() => {
          if (response) {
            this.loading = false;
          }
        }, 1000);

        if (api.name === "lab.isaaclin.cn") {
          const info = response.data.results[0];
          this.confirmed = parseInt(info.confirmedCount);
          this.deaths = parseInt(info.deathCount);
        }
        if (api.name === "arcgis.com") {
          const info = response.data.features[15].attributes;
          this.confirmed = parseInt(info.Confirmed);
          this.deaths = parseInt(info.Deaths);
        }
        // this.recovered = parseInt(info.Recovered); // Not reported for Norway
      });
    }
  },
  mounted() {
    this.selectedAPI = this.API[0];
    this.init(this.selectedAPI);
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
