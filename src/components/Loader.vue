<template>
  <v-dialog v-model="getShowLoader" max-width="500">
    <template v-slot:default="{ isActive }" >
      <div class="pa-10 mx-auto bg-white">
        <v-progress-circular
            :width="10"
            color="success"
            size="150"
            class="mx-auto"
            indeterminate
          >
          <span class="font-weight-bold text-h5">
            Loading
          </span>
        </v-progress-circular>
      </div>
    </template>
  </v-dialog>
</template>

<script>
import { traceMyMoneyStore } from "@/stores/traceMyMoneyStore";
import { mapState } from 'pinia'

export default {
  computed: {
    ...mapState(traceMyMoneyStore, [
      "getShowLoader"
    ])
  }
}
</script>
