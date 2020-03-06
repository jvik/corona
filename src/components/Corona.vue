<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div class="container">
      <apexchart
        type="bar"
        :options="chartOptions"
        :series="series"
      ></apexchart>
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
      confirmed: 0,
      deaths: 0,
      recovered: 0,
      chartOptions: {
        chart: {
          id: "vuechart-example"
        },
        xaxis: {
          categories: ["Sykdom", "Dødsfall"]
        }
      }
    };
  },
  methods: {
    init() {
      this.$http
        .get(
          "https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/2/query?f=json&where=Confirmed%20%3E%200&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=Confirmed%20desc&resultOffset=0&resultRecordCount=100&cacheHint=true"
        )
        .then(response => {
          const info = response.data.features[15].attributes;
          this.confirmed = parseInt(info.Confirmed);
          this.deaths = parseInt(info.Deaths);
          // this.recovered = parseInt(info.Recovered); // Not reported for Norway
        });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style scoped>
.container {
  margin: auto;
  max-width: 80%;
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
