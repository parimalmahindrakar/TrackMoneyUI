<template>
  <v-container class="mt-5">
    <div class="d-flex justify-space-between">
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
      <div class="w-100 d-flex">
        <v-row>
          <v-col cols="9">
            <v-expansion-panel class="chip-container mb-10">
              <v-expansion-panel-title>
                <template v-slot:default="{ expanded }">
                  <v-row no-gutters>
                    <v-col class="d-flex justify-start align-center" cols="8">
                      Add an expense
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row class="w-100">
                  <v-col cols="6">
                    <v-select
                      :items="items"
                      v-model="selectedBank"
                      placeholder="Select the bank"
                    ></v-select>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Add the date"
                      v-model="expenseEntryCreationDate"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <div class="d-flex justify-center align-center">
                  <div class="w-75 mx-auto mt-3">
                    <template v-for="item, index in initialExpenseEntriesList" :key="index">
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
                          <v-icon @click="removeInitialExpenseEntry(index)">
                            mdi-minus
                          </v-icon>
                        </v-col>
                      </v-row>
                    </template>
                    <div class="d-flex justify-center align-center">
                      <v-chip class="ml-4 mt-3 cursor-pointer bg-dark w-25 text-center" @click="addInitialExpenseEntry(e)">+ Add entry</v-chip>
                      <v-chip
                        v-if="initialExpenseEntriesList.length >= 1"
                        class="ml-4 mt-3 cursor-pointer bg-dark w-25"
                        @click="submitExpense">
                        Submit
                      </v-chip>
                    </div>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-col>
          <v-col cols="3">
            <v-expansion-panel class="chip-container mb-10">
              <v-expansion-panel-title>
                <template v-slot:default="{ expanded }">
                  <v-row no-gutters>
                    <v-col class="d-flex justify-start align-center" cols="8">
                      Create the tag
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-combobox
                  clearable
                  :items="entryTags"
                  v-model="newEntryTag"
                ></v-combobox>
                <v-btn class="w-100" @click="addTag">Submit</v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-col>
        </v-row>
      </div>
      <div class="scrollable-panel w-100">
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
import { filterValidExpenses } from '../helper/helper'

export default {
  data() {
    return {
      banksList: [],
      expensesList: [],
      filteredExpensesList: [],
      expenseEntriesList: reactive([]),
      entryTags: [],
      newEntryTag: null,
      selectedBank: '',
      items: [],
      initialExpenseEntriesList: reactive([]),
      expenseEntryCreationDate: '',
      TM_BACKEND_URL: import.meta.env.VITE_TM_BACKEND_URL
    }
  },
  async mounted() {
    const expensesResponse = await axios.get("expenses/",
                              { baseURL: this.TM_BACKEND_URL })
    const banksResponse = await axios.get("banks/",
                              { baseURL: this.TM_BACKEND_URL })
    const tagsResponse = await axios.get("entry-tags/",
                              { baseURL: this.TM_BACKEND_URL })
    if (banksResponse.status == 200) {
      this.banksList = banksResponse.data.banks.map(ele => ({
        "bankName": ele.name,
        "remainingBalance": ele.current_balance,
        "bankId": ele.id
      }))
      this.items = this.banksList.map(ele => ({ title: ele.bankName, value: ele.bankId }))
    }
    if (expensesResponse.status == 200) {
      this.expensesList = expensesResponse?.data?.expenses
      this.filteredExpensesList = this.expensesList
    }
    if (tagsResponse.status == 200) {
      this.entryTags = tagsResponse?.data?.entry_tags.map(ele => ele.name)
    }
    const date = new Date()
    this.expenseEntryCreationDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} 00:00`
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
        const expensesResponse = await axios.delete("expenses/delete",
          {
            params: {
              id: id
            },
            baseURL: this.TM_BACKEND_URL
          }
        )
        if (expensesResponse.status == 204) {
          window.location.reload()
        }
      }
    },
    async addTag(extraParam=null, e_id=null, ee_id=null){
      if (this.newEntryTag) {
        const entryTagsResponse = await axios.post("entry-tags/create",
          { "name": this.newEntryTag },
          { baseURL: this.TM_BACKEND_URL}
        )
        if (entryTagsResponse.status == 201) {
          window.location.reload()
        }
      } else if (e_id !== null && ee_id !== null) {

      }
    },
    async deleteExpenseEnrty(expenseId, expenseEntryId) {
      const answer = confirm("Are you sure you wnat to delete this entry ?")
      if (answer) {
        const expensesResponse = await axios.delete("expenses/delete-entry",
          {
            params: {
              id: expenseId,
              ee_id: expenseEntryId
            },
            baseURL: this.TM_BACKEND_URL
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
      axios.patch("expenses/add-entry",
        filterValidExpenses(this.expenseEntriesList),
        {
          params: {
            id: _id
          },
          baseURL: this.TM_BACKEND_URL
        }
      ).then(res => {
        if (res.status ==  201) {
          window.location.reload()
        }
      })
    },
    addInitialExpenseEntry() {
      this.initialExpenseEntriesList.push({
        "amount": null,
        "description": null
      })
    },
    removeInitialExpenseEntry(counter) {
      this.initialExpenseEntriesList.splice(counter, 1)
    },
    submitExpense() {
      const data =  {
        "bank_id": this.selectedBank,
        "expenses": filterValidExpenses(this.initialExpenseEntriesList),
        "created_at": this.expenseEntryCreationDate
      }
      axios.post("expenses/create",
        data,
        { baseURL: this.TM_BACKEND_URL }
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
