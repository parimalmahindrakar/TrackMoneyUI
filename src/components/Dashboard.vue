<template>
  <v-app-bar scroll-behavior="hide">
    <v-container>
      <div class="d-flex justify-space-between align-center">
        <span class="text-h5">
          Trace My Money
        </span>
        <span>
          <span v-if="getLoggedInStatus">
            Hello, {{ getUserName }}
            <span
              color="primary"
              class="cursor-pointer"
            >
              <v-icon
                icon="mdi-logout"
                end
                @click="logoutUser"
              ></v-icon>
            </span>
          </span>
          <div v-else>
            <v-btn-toggle
              color="success"
              v-model="toggleLogin"
            >
              <v-btn @click="() => { setLoginPageStatus(true) } ">Login</v-btn>
              <v-btn @click="() => { setLoginPageStatus(false) } ">Register</v-btn>
            </v-btn-toggle>
          </div>
        </span>
      </div>
    </v-container>
  </v-app-bar>
  <v-container class="mt-15" v-if="getLoggedInStatus">
    <div class="d-flex justify-space-between mt-8">
      <Bank
        v-for="(bank, index) in getBanksList"
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
                      :items="getBankItems"
                      v-model="selectedBank"
                      placeholder="Select the bank"
                    ></v-select>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      label="Add the date"
                      v-model="getExpenseEntryCreationDate"
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
                        @click="submitExpenseSoft">
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
          v-for="expense in getFilteredExpensesList"
          :key="expense"
          class="chip-container"
        >
          <v-expansion-panel-title>
            <template v-slot:default="{ expanded }">
              <v-row no-gutters>
                <v-col class="d-flex justify-start align-center" cols="8">
                  {{(expense.created_at).slice(0, 10)}} | {{ expense.day }} @ {{expense.bank_name}}
                  <div>
                    <v-chip size="x-small" class="ml-2 hover-chip" @click="deleteExpenseSoft(expense.id)">
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
                  <v-chip size="x-small" class="ml-2 hover-entry-chip" @click="deleteExpenseEnrtySoft(expense.id, item.ee_id)">
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
                  @click="submitExpenseEntrySoft(expense.id)">
                  Submit
                </v-chip>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </div>
    </v-expansion-panels>
  </v-container>
  <v-container class="mt-15" v-else>
    <div class="mt-15 d-flex justify-center align-center">
      <LoginVue v-if="getLoginPageStatus"/>
      <RegisterVue v-if="!getLoginPageStatus"/>
    </div>
  </v-container>

</template>

<script>
import axios from "axios";
import { reactive } from "vue";
import { mapActions, mapState } from 'pinia'
import { traceMyMoneyStore } from "@/stores/traceMyMoneyStore";
import { filterValidExpenses } from '../helper/helper'

// components
import LoginVue from './Login.vue';
import RegisterVue from './Register.vue';

export default {
  data() {
    return {
      expenseEntriesList: reactive([]),
      entryTags: [],
      newEntryTag: null,
      selectedBank: '',
      toggleLogin: 0,
      initialExpenseEntriesList: reactive([]),
      expenseEntryCreationDate: ''
    }
  },
  components: {
    LoginVue,
    RegisterVue
  },
  computed: {
    ...mapState(traceMyMoneyStore, [
      "getUserName",
      "getLoggedInStatus",
      "getExpenseEntryCreationDate",
      "getBanksList",
      "getExpensesList",
      "getBankItems",
      "getLoginPageStatus",
      "getFilteredExpensesList"
    ])
  },
  async created() {
    this.getInitialData()
  },
  methods: {
    ...mapActions(traceMyMoneyStore, [
      "getInitialData",
      "deleteExpense",
      "deleteExpenseEnrty",
      "createNewTag",
      "submitExpense",
      "submitExpenseEntry",
      "logoutUser",
      "setLoginPageStatus",
      "setFilteredExpensesList"
    ]),

    // API related functions
    handleBankClick(bank) {
      this.setFilteredExpensesList(bank)
    },
    deleteExpenseSoft(expenseId) {
      if (confirm("Are you sure you want to delete this expense ?")) {
        this.deleteExpense(expenseId)
      }
    },
    deleteExpenseEnrtySoft(expenseId, expenseEntryId) {
      if (confirm("Are you sure you wnat to delete this entry ?")) {
        this.deleteExpenseEnrty(expenseId, expenseEntryId)
      }
    },
    addTag(extraParam=null, e_id=null, ee_id=null){
      if (this.newEntryTag) {
        this.createNewTag(this.newEntryTag)
      } else if (e_id !== null && ee_id !== null) {
        // TODO: for future purpose
      }
    },
    submitExpenseSoft() {
      const data = {
        "bank_id": this.selectedBank,
        "expenses": filterValidExpenses(this.initialExpenseEntriesList),
        "created_at": this.expenseEntryCreationDate
      }
      this.submitExpense(data)
    },
    submitExpenseEntrySoft(expenseId) {
      const filterdExpenseEntries = filterValidExpenses(this.expenseEntriesList)
      this.submitExpenseEntry(expenseId, filterdExpenseEntries)
    },

    // UI related functions
    addExpenseEntry() {
      this.expenseEntriesList.push({
        "amount": null,
        "description": null
      })
    },
    removeExpenseEntry(counter) {
      this.expenseEntriesList.splice(counter, 1)
    },
    addInitialExpenseEntry() {
      this.initialExpenseEntriesList.push({
        "amount": null,
        "description": null
      })
    },
    removeInitialExpenseEntry(counter) {
      this.initialExpenseEntriesList.splice(counter, 1)
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
