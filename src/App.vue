<template>
  <v-app>
    <Corona msg="Norsk Coronastatistikk (COVID-19)" />
  </v-app>
</template>

<script>
import Corona from "./components/Corona.vue";

export default {
  name: "App",
  components: {
    Corona
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
