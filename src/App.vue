<template>
  <v-app :class="[{'bg-grey-darken-4': getIsDarkMode}]">
    <Dashboard/>
    <Loader/>
  </v-app>
</template>

<script>
  import Dashboard from './components/Dashboard.vue';
  import Loader from './components/Loader.vue'
  import { traceMyMoneyStore } from "@/stores/traceMyMoneyStore";
  import { mapState } from 'pinia'

  export default {
      computed: {
          ...mapState(traceMyMoneyStore, [
              "getIsDarkMode"
          ])
      },
  }
</script>
