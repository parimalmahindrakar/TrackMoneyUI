<template>
  <v-container class="mt-5">
    <div class="d-flex">
      <Bank
        v-for="(bank, index) in banksList"
        :key="index"
        :bankName="bank.bankName"
        :remainingBalance="bank.remainingBalance"
        @click="handleBankClick(bank)"
      />
    </div>
    <v-divider class="my-10" thickness="2" color="black"></v-divider>
    <v-expansion-panels>
      <div class="scrollable-panel w-75">
        <v-expansion-panel
          v-for="expense in filteredExpensesList"
          :key="expense"
        >
          <v-expansion-panel-title>
            <template v-slot:default="{ expanded }">
              <v-row no-gutters>
                <v-col class="d-flex justify-start" cols="8">
                  {{(expense.created_at).slice(0, 10)}} | {{ expense.day }} @ {{expense.bank_name}}
                </v-col>
                <v-col
                  cols="2"
                  class="text-center"
                >
                  <span class="font-weight-bold">{{expense.remaining_amount_till_now}}/-</span>
                </v-col>
                <v-col
                  cols="2"
                  class="text-center"
                >
                  <span class="font-weight-bold">{{expense.expense_total}}/-</span>
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-divider class="w-75 mx-auto"></v-divider>
            <div v-for="item in expense.expenses" :key="item.id" >
              <div class="d-flex justify-space-between w-75 mx-auto align-center">
                <div class="ml-4 my-2">{{item.description}}</div>
                <div class="mr-4 ">{{item.amount}}/-</div>
              </div>
              <v-divider class="w-75 mx-auto"></v-divider>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </div>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      banksList: [],
      expensesList: [],
      filteredExpensesList: []
    }
  },
  async mounted() {
    const headers = {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    }
    const expensesResponse = await axios.get("http://127.0.0.1:5000/expenses/",
        { headers:headers }
    )
    const banksResponse = await axios.get("http://127.0.0.1:5000/banks/",
        { headers:headers }
    )
    if (banksResponse.status == 200) {
      this.banksList = banksResponse.data.banks.map(ele => ({ "bankName": ele.name, "remainingBalance": ele.current_balance }))
    }
    if (expensesResponse.status == 200) {
      this.expensesList = expensesResponse?.data?.expenses
      this.filteredExpensesList = this.expensesList
    }
  },
  methods: {
    // TODO: make usable following method
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleString().slice(1, 10)
    },
    handleBankClick(bank) {
      this.filteredExpensesList = this.expensesList.filter(ele => ele.bank_name === bank.bankName)
    }
  }
}

</script>

<style>
.scrollable-panel {
  max-height: 700px;
  overflow-y: auto;
}
</style>
