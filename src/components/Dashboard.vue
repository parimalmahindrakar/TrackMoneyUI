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
          class="chip-container"
        >
          <v-expansion-panel-title>
            <template v-slot:default="{ expanded }">
              <v-row no-gutters>
                <v-col class="d-flex justify-start align-center" cols="8">
                  {{(expense.created_at).slice(0, 10)}} | {{ expense.day }} @ {{expense.bank_name}}
                  <div>
                    <v-chip size="x-small" class="ml-2 hover-chip" @click="deleteExpense(expense.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-chip>
                  </div>
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
              <div class="d-flex justify-space-between w-75 mx-auto align-center expense-entry">
                <div class="ml-4 my-2">
                  {{item.description}}
                  <v-chip size="x-small" class="ml-2 hover-entry-chip" @click="deleteExpenseEnrty(expense.id, item.ee_id)">
                    <v-icon>mdi-delete</v-icon>
                  </v-chip>
                </div>
                <div class="mr-4 ">{{item.amount}}/-</div>
              </div>
              <v-divider class="w-75 mx-auto"></v-divider>
            </div>
            <div class="w-75 mx-auto mt-3">
                <template v-for="item, index in expenseEntriesList" :key="index">
                  <v-row class="mx-2">
                    <v-col cols="3">
                      <v-text-field
                        v-model="item.amount"
                        color="primary"
                        label="Amount"
                        type="number"
                        variant="underlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                      v-model="item.description"
                        color="primary"
                        label="Description"
                        variant="underlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="1">
                      <v-icon @click="removeExpenseEntry(index)">
                        mdi-minus
                      </v-icon>
                    </v-col>
                  </v-row>
                </template>
                <v-chip class="ml-4 mt-3 cursor-pointer bg-dark" @click="addExpenseEntry(e)">+ Add entry</v-chip>
                <v-chip
                  v-if="expenseEntriesList.length >= 1"
                  class="ml-4 mt-3 cursor-pointer bg-dark"
                  @click="submitExpenseEntry(expense.id)">
                  Submit
                </v-chip>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </div>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import axios from "axios";
import { reactive } from "vue";

export default {
  data() {
    return {
      banksList: [],
      expensesList: [],
      filteredExpensesList: [],
      expenseEntriesList: reactive([]),
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
      },
      selectedBank: '',
      items: [],
    }
  },
  async mounted() {
    const expensesResponse = await axios.get("http://127.0.0.1:5000/expenses/",
        { headers:this.headers }
    )
    const banksResponse = await axios.get("http://127.0.0.1:5000/banks/",
        { headers:this.headers }
    )
    if (banksResponse.status == 200) {
      this.banksList = banksResponse.data.banks.map(ele => ({
        "bankName": ele.name,
        "remainingBalance": ele.current_balance,
        "bankId": ele.id
      }))
      this.items = this.banksList.map(ele => ({ bankName: ele.bankName, value: ele.bankId }))

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
    },
    async deleteExpense(id) {
      const answer = confirm("Are you sure you wnat to delete this expense ?")
      if (answer) {
        const expensesResponse = await axios.delete("http://127.0.0.1:5000/expenses/delete",
          {
            headers: this.headers,
            params: {
              id: id
            }
          }
        )
        if (expensesResponse.status == 204) {
          window.location.reload()
        }
      }
    },
    async deleteExpenseEnrty(expenseId, expenseEntryId) {
      const answer = confirm("Are you sure you wnat to delete this entry ?")
      if (answer) {
        const expensesResponse = await axios.delete("http://127.0.0.1:5000/expenses/delete-entry",
          {
            headers: this.headers,
            params: {
              id: expenseId,
              ee_id: expenseEntryId
            }
          }
        )
        if (expensesResponse.status == 204) {
          window.location.reload()
        }
      }
    },
    addExpenseEntry() {
      this.expenseEntriesList.push({
        "amount": null,
        "description": null
      })
    },
    removeExpenseEntry(counter) {
      this.expenseEntriesList.splice(counter, 1)
    },
    submitExpenseEntry(_id) {
      let validEntries = this.expenseEntriesList.filter(ele => ele.amount && ele.description)
      validEntries = validEntries.map((ele) => {
          if (ele.amount < 0) {
              return {
                  "amount": ele.amount,
                  "description": ele.description,
                  "expense_entry_type": "ADD"
              }
          } else {
              return ele
          }
      })
      axios.patch("http://127.0.0.1:5000/expenses/add-entry",
        this.expenseEntriesList,
        {
          headers: this.headers,
          params: {
            id: _id
          }
        }
      ).then(res => {
        if (res.status ==  201) {
          window.location.reload()
        }
      })
    }
  }
}

</script>

<style>
.scrollable-panel {
  max-height: 700px;
  overflow-y: auto;
}
.hover-chip,.hover-entry-chip {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chip-container:hover .hover-chip {
  opacity: 1;
}
.expense-entry:hover .hover-entry-chip {
  opacity: 1;
}
</style>
