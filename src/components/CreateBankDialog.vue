<template>
  <v-dialog v-model="getCreateBankDialogVisible" max-width="500">
    <template v-slot:default="{ isActive }">
      <v-card
        title="Create the bank data"
        :class="{'bg-grey-darken-4': getIsDarkMode}"
      >
        <v-text-field
          class="mx-4"
          color="success"
          label="Bank Name"
          variant="outlined"
          v-model="bankName"
          @input="toUpperCase"
        ></v-text-field>
        <v-text-field
          class="mx-4"
          color="success"
          label="Initial Balance"
          variant="outlined"
          type="number"
          v-model="initialBalance"
        ></v-text-field>

        <v-divider class="w-75 mx-auto mb-3"></v-divider>
        <v-card-actions class="mx-2 mb-4">
          <v-spacer></v-spacer>
          <div class="d-flex justify-space-between w-100">
            <v-btn
              class="w-40"
              variant="outlined"
              color="success"
              :disabled="!(bankName && initialBalance)"
              @click="() => { createBankSoft(false) }">
              Create Bank
            </v-btn>
            <v-btn class="w-40" variant="outlined" color="warning" @click="() => { setCreateBankDialogVisible(false) }">Cancel</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import { traceMyMoneyStore } from "@/stores/traceMyMoneyStore";
import { mapActions, mapState } from 'pinia'

export default {
  data() {
    return {
      bankName: null,
      initialBalance: null
    }
  },
  computed: {
    ...mapState(traceMyMoneyStore, [
      "getCreateBankDialogVisible",
      "getIsDarkMode"
    ])
  },
  methods: {
    ...mapActions(traceMyMoneyStore, [
      "setCreateBankDialogVisible",
      "createBank"
    ]),
    createBankSoft() {
      this.createBank({
        "name": this.bankName,
        "initial_balance": this.initialBalance,
      })
    },
    toUpperCase() {
      this.bankName = this.bankName.toUpperCase()
    }
  }
}
</script>
