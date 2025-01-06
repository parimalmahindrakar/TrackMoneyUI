<template>
  <AlertVue/>
  <NavbarVue/>
  <CreateBankDialogVue/>
  <ApplyEntryTagsVue :tagInfo="applyTagInfo" />
  <v-container class="mt-15 w-xl-75 w-100" v-if="getLoggedInStatus">
    <BankVue/>
    <v-expansion-panels>
      <div class="w-100 w-lg-75 mb-5">
        <v-btn-toggle
          rounded
          color="success border border-grey"
          class="d-flex justify-space-between"
          v-model="toggleActionsFilter"
          elevation="3"
          density="compact"
          variant="outlined"
        >
          <v-btn variant="outlined border border-none"
            @click="showFilter = !showFilter"
          >Actions</v-btn>
          <v-btn variant="outlined border border-none"
            @click="showFilter = !showFilter"
          >Filters</v-btn>
        </v-btn-toggle>
      </div>
      <div v-if="showFilter" class="w-100 w-lg-75">
        <v-row>
          <v-col cols="12" md="6" lg="8">
            <v-expansion-panel class="chip-container">
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
                <div class="d-flex flex-column mt-3">
                  <v-select
                    :items="getBankItems"
                    v-model="selectedBank"
                    variant="outlined"
                    label="Select the bank"
                    class="w-100"
                  ></v-select>
                  <v-text-field
                    label="Add the date"
                    variant="outlined"
                    v-model="getExpenseEntryCreationDate"
                    @update:modelValue="changeExpenseEntryCreationDate"
                  ></v-text-field>
                </div>
                <div class="d-flex justify-center align-center">
                  <div class="w-100 mx-auto">
                    <template v-for="item, index in initialExpenseEntriesList" :key="index">
                      <v-row>
                        <v-col cols="4">
                          <v-text-field
                            v-model="item.amount"
                            color="primary"
                            label="Amount"
                            type="number"
                            density="compact"
                            class="custom-hide_input_details"
                            variant="outlined"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="7">
                          <v-text-field
                            v-model="item.description"
                            color="primary"
                            density="compact"
                            class="custom-hide_input_details"
                            label="Description"
                            variant="outlined"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="1">
                          <v-icon @click="removeInitialExpenseEntry(index)">
                            mdi-minus
                          </v-icon>
                        </v-col>
                        <v-select
                          class="mx-3 custom-hide_input_details"
                          variant="outlined"
                          density="compact"
                          label="Select the tag"
                          v-model="item.selected_tags"
                          :items="getEntryTags"
                          multiple
                        >
                        </v-select>
                      </v-row>
                    </template>
                    <div class="d-flex justify-center align-center mt-5">
                      <v-btn
                        rounded
                        variant="tonal"
                        class=" mt-3 cursor-pointer bg-dark w-50 text-center"
                        @click="addInitialExpenseEntry(e)">
                        + Add entry
                      </v-btn>
                      <v-btn
                        rounded
                        variant="tonal"
                        v-if="initialExpenseEntriesList.length >= 1"
                        class="ml-4 mt-3 cursor-pointer bg-dark w-50"
                        @click="submitExpenseSoft">
                        Submit
                      </v-btn>
                    </div>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-col>
          <v-col cols="12" md="6" lg="4">
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
                  variant="outlined"
                  placeholder="Enter the name of tag"
                  :items="getEntryTags"
                  v-model="newEntryTag"
                ></v-combobox>
                <v-btn class="w-100" @click="addTag">Submit</v-btn>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-col>
        </v-row>
      </div>

      <!-- Advanced Expenses Search -->
      <div v-if="!showFilter" class="w-lg-75 w-100">
          <div class="d-flex justify-space-between">
            <v-select
              variant="outlined"
              density="compact"
              v-model="getSearchSelectedTags"
              :items="getEntryTags"
              label="Tags"
              class="custom-hide_input_details mr-2 w-25"
              multiple
              @update:model-value="updateSearchSelectedTags($event)"
            >
            </v-select>
            <v-select
              variant="outlined"
              density="compact"
              v-model="getSearchSelectedBanks"
              :items="getBankItems"
              class="custom-hide_input_details mr-2 w-25"
              label="Banks"
              @update:model-value="updateSearchSelectedBanks($event)"
              multiple
            >
            </v-select>
            <v-select
              variant="outlined"
              density="compact"
              class="custom-hide_input_details w-40"
              :items="dateranges"
              v-model="getSearchSelectedDaterange"
              label="Daterange"
              clearable
              @update:model-value="updateSearchSelectedDaterange($event)"
            >
            </v-select>
          </div>
          <div class="d-flex my-3">
            <v-text-field
              variant="outlined"
              density="compact"
              v-model="getSearchEntryKeyword"
              class="custom-hide_input_details mr-2 w-50"
              label="Search by keyword"
              @update:model-value="updateSearchEntryKeyword($event)"
            >
            </v-text-field>
            <v-select
              variant="outlined"
              density="compact"
              label="Operator"
              class="custom-hide_input_details mr-2"
              v-model="getSearchOperator"
              :items="operatorItems"
              @update:model-value="updateSearchOperator($event)"
            >

            </v-select>
            <v-select
              v-model="getPageSize"
              :items="pazeSizes"
              variant="outlined"
              class="custom-hide_input_details"
              density="compact"
              @update:modelValue="onPageChange($event, 'pageSize')"
            >
            </v-select>
          </div>
          <div class="d-flex">
            <div class="w-100">
              <v-btn
                :disabled="false"
                class="w-100 border-e-0 mr-2"
                color="success"
                variant="outlined"
                @click="makeSoftAdvancedExpenseSearch"
                >
                Search
              </v-btn>
            </div>
            <div>
              <v-btn
                variant="outlined"
                :class="getIsAdvancedSearch ? 'bg-success text-white border border-1' : 'bg-white text-green'"
                @click="resetAdvancedSearch"
              >
                <v-icon
                >
                  mdi-refresh
                </v-icon>
              </v-btn>
            </div>
          </div>
      </div>
      <div class="w-100 mt-5 w-lg-75">
        <v-expansion-panel
          v-for="expense in getFilteredExpensesList"
          :key="expense"
          class="chip-container"
        >
          <v-expansion-panel-title class="px-2 mb-3">
            <template v-slot:default="{ expanded }">
              <v-row no-gutters>
                <v-col class="d-flex justify-space-between align-center" cols="12">
                  {{(expense.created_at).slice(0, 10)}} | {{ expense.day }} @ {{expense.bank_name}}
                  <div>
                    <v-chip size="x-small" class="ml-2 hover-chip" @click="deleteExpenseSoft(expense.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-chip>
                  </div>
                </v-col>
                <v-col cols="12" class="d-flex mt-2 justify-space-between">
                    <span class="font-weight-bold">Remaining : {{expense.remaining_amount_till_now}}/-</span>
                    <span class="font-weight-bold"> {{expense.expense_total}}/-</span>
                </v-col>
              </v-row>
            </template>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-divider class="w-100 mx-auto mb-1"></v-divider>
            <div v-for="item in expense.expenses" :key="item.id" >
              <div class="d-flex flex-column justify-space-between expense-entry mx-lg-10">
                <v-row>
                  <v-col cols="8">
                    <span
                      class="text-left cursor-pointer"
                      @click="getEntryInformation(expense, item)">
                      {{item.description}}
                      <v-icon
                        v-if="item.entry_tags?.length > 0"
                        size="x-small"
                        color="success"
                      >
                        mdi-tag
                      </v-icon>
                    </span>
                    <v-chip
                      size="x-small"
                      class="hover-entry-chip ml-4"
                      @click="deleteExpenseEnrtySoft(expense.id, item.ee_id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-chip>
                  </v-col>
                  <v-col cols="4">
                    <div class="font-weight-bold text-right">
                      {{ item.amount < 0 ? `+ ${Math.abs(item.amount)}/-`: `${item.amount}/-` }}
                    </div>
                  </v-col>
                </v-row>
                <div class="ml-3 font-weight-bold"></div>
              </div>
              <v-divider class="w-100 mx-auto mt-1"></v-divider>
            </div>
            <div class="w-100 mt-3">
                <template v-for="item, index in expenseEntriesList" :key="index">
                  <v-row>
                    <v-col cols="5">
                      <v-text-field
                        v-model="item.amount"
                        color="primary"
                        class="custom-hide_input_details"
                        label="Amount"
                        type="number"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="7">
                      <v-text-field
                        v-model="item.description"
                        color="primary"
                        class="custom-hide_input_details"
                        label="Description"
                        density="compact"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="w-100 d-flex">
                      <v-select
                        class="w-100 mr-3 custom-hide_input_details"
                        variant="outlined"
                        label="Select the tag"
                        density="compact"
                        v-model="item.entry_tags"
                        :items="getEntryTags"
                        multiple
                      >
                      </v-select>
                      <v-icon @click="removeExpenseEntry(index)">
                        mdi-minus
                      </v-icon>
                    </v-col>
                  </v-row>
                </template>
                <div class="mt-6 d-flex justify-space-between">
                  <v-btn
                    variant="outlined"
                    class=" cursor-pointer w-40 bg-dark"
                    @click="addExpenseEntry(e)">+ Add entry</v-btn>
                  <v-btn
                    v-if="expenseEntriesList.length >= 1"
                    variant="outlined"
                    class=" cursor-pointer w-40 bg-dark"
                    @click="submitExpenseEntrySoft(expense.id)">
                    Submit
                  </v-btn>
                </div>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </div>
    </v-expansion-panels>
    <div class="border rounded-sm pa-1 mt-2 d-flex justify-space-between bg-green-accent-1 w-lg-75 w-100 mx-auto">
      <span class="font-weight-bold text-green-darken-2">Total  : </span>
      <span class="font-weight-bold text-green-darken-2"> {{getCurrentTotalOfExpenses}}/- </span>
    </div>
    <v-pagination
      v-model="getPageNumber"
      :length="(getCurrentTotalExpenses / getPageSize) + 1"
      :total-visible="6"
      class="mt-5 w-100"
      size="x-small"
      variant="elevated"
      active-color="success"
      @next="onPageChange($event, 'pageNumber')"
      @prev="onPageChange($event, 'pageNumber')"
      @update:modelValue="onPageChange($event, 'pageNumber')"
    ></v-pagination>
  </v-container>
  <v-container class="mt-15" v-else>
    <div class="mt-15 d-flex justify-center align-center">
      <LoginVue v-if="getLoginPageStatus"/>
      <RegisterVue v-if="!getLoginPageStatus"/>
    </div>
  </v-container>
</template>

<script>
import { reactive } from "vue";
import { mapActions, mapState } from 'pinia'
import { traceMyMoneyStore } from "@/stores/traceMyMoneyStore";
import { filterValidExpenses } from '../helper/helper'

// components
import LoginVue from './Login.vue';
import RegisterVue from './Register.vue';
import BankVue from "./Bank.vue";
import NavbarVue from './Navbar.vue';
import AlertVue from './Alert.vue';
import CreateBankDialogVue from './CreateBankDialog.vue';
import ApplyEntryTagsVue from './ApplyEntryTags.vue';

// constants
import {
  DATERANGES,
  OPERATORS,
  PAGE_SIZES,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE
} from '../constants/constants'

export default {
  data() {
    return {
      expenseEntriesList: reactive([]),
      newEntryTag: null,
      selectedBank: '',
      initialExpenseEntriesList: reactive([]),
      applyTagInfo: reactive({}),
      pageNumber: 1,
      pageSize: 5,
      showAction: false,
      showFilter: false,
      toggleActionsFilter: 1,
      dateranges: DATERANGES,
      operatorItems: OPERATORS,
      pazeSizes: PAGE_SIZES
    }
  },
  components: {
    LoginVue,
    RegisterVue,
    BankVue,
    NavbarVue,
    AlertVue,
    CreateBankDialogVue,
    ApplyEntryTagsVue
  },
  computed: {
    ...mapState(traceMyMoneyStore, [
      "getLoggedInStatus",
      "getExpenseEntryCreationDate",
      "getBankItems",
      "getLoginPageStatus",
      "getFilteredExpensesList",
      "getEntryTags",
      "getAlertErrorMessages",
      "getCurrentTotalExpenses",
      "getPageNumber",
      "getPageSize",
      "getSearchSelectedTags",
      "getSearchSelectedBanks",
      "getSearchEntryKeyword",
      "getSearchSelectedDaterange",
      "getSearchOperator",
      "getCurrentTotalOfExpenses",
      "getIsAdvancedSearch"
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
      "setExpenseEntryCreationDate",
      "setApplyEntryTagVisible",
      "fetchExpenses",
      "setPageNumber",
      "setPageSize",
      "setSearchOperator",
      "setSearchSelectedTags",
      "setSearchSelectedBanks",
      "setSearchEntryKeyword",
      "setSearchSelectedDaterange",
      "setAdvancedSearch"
    ]),

    // API related functions
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
        "description": null,
        "entry_tags": []
      })
    },
    removeExpenseEntry(counter) {
      this.expenseEntriesList.splice(counter, 1)
    },
    addInitialExpenseEntry() {
      this.initialExpenseEntriesList.push({
        "amount": null,
        "description": null,
        "selected_tags": []
      })
    },
    removeInitialExpenseEntry(counter) {
      this.initialExpenseEntriesList.splice(counter, 1)
    },
    changeExpenseEntryCreationDate(chagnedDate) {
      this.setExpenseEntryCreationDate(chagnedDate)
    },
    getEntryInformation(expense, entry) {
      this.applyTagInfo = {
        ...entry,
        ...{
          expenseId: expense.id
        }
      }
      this.setApplyEntryTagVisible(true)
    },
    onPageChange(event, eventType) {
      if (eventType === "pageNumber") {
        this.setPageNumber(event)
      }
      if (eventType === "pageSize") {
        this.setPageSize(event)
      }
      this.fetchExpenses()
    },
    updateSearchOperator(event) {
      this.setSearchOperator(event)
    },
    updateSearchSelectedTags(event) {
      this.setSearchSelectedTags(event)
    },
    updateSearchSelectedBanks(event) {
      this.setSearchSelectedBanks(event)
    },
    updateSearchEntryKeyword(event) {
      this.setSearchEntryKeyword(event)
    },
    updateSearchSelectedDaterange(event) {
      this.setSearchSelectedDaterange(event)
    },
    makeSoftAdvancedExpenseSearch() {
      this.setAdvancedSearch(true)
      this.fetchExpenses()
    },
    resetAdvancedSearch() {
      this.setPageNumber(DEFAULT_PAGE_NUMBER)
      this.setPageSize(DEFAULT_PAGE_SIZE)
      this.setSearchOperator("and")
      this.setSearchSelectedTags([])
      this.setSearchSelectedBanks([])
      this.setSearchEntryKeyword("")
      this.setSearchSelectedDaterange(null)
      this.setAdvancedSearch(false)
    }
  }
}

</script>

<style>
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
  .v_alert_changes {
    position: absolute !important;
    top: 10%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 60px;
    z-index: 10000;
    opacity: 0;
    transition: top 0.5s ease, opacity 0.5s ease;
  }
  .make-opacity{
    opacity: 1;
  }
  .v-carousel__controls {
    display: none !important;
  }
  .v-expansion-panel-title__icon {
    display: none !important;
  }
  .w-40 {
    width: 40%;
  }
  .w-80 {
    width: 80%;
  }
  .custom-btn-toggle {
    display: flex;
    flex-direction: row;
  }
  .custom-btn {
    font-size: 16px;
  }
  @media (max-width: 600px) {
    .custom-btn-toggle {
      flex-direction: column;
    }
    .custom-btn {
      font-size: 12px;
      padding: 6px 12px;
    }
  }
  .custom-hidden {
    opacity: 0;
  }
  .custom-hide_input_details .v-input__details {
    display: none;
  }
</style>
