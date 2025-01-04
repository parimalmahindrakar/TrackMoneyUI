<template>
    <v-sheet
      class="mx-auto w-lg-75 w-100 mb-8 mt-10"
      elevation="8"
    >
        <v-slide-group
            v-model="model"
            class="pa-4 d-flex"
            show-arrows="false"
            mobile="true"
        >
            <v-slide-group-item
                v-for="(bank, index) in getBanksList"
                :key="index"
                v-slot="{ isSelected, toggle }"
            >
                <div @click="handleBankClick(bank)">
                    <v-card
                        height="300"
                        :class="isSelected ? 'bg-success' : undefined"
                        width="300"
                        @click="toggle"
                        class="mr-4"
                    >
                        <v-chip color="red custom-chip" @click="deleteBankSoft(bank.bankId)">
                            <v-icon color="red">
                                mdi-delete
                            </v-icon>
                        </v-chip>
                        <v-scale-transition>
                            <v-row>
                                <v-col cols="12" class="text-center">
                                    <v-card-title class="text-h2">{{ bank.bankName }}</v-card-title>
                                </v-col>
                                <v-col cols="12" class="text-center">
                                    <v-card-subtitle class="text-h2">{{ bank.remainingBalance }}</v-card-subtitle>
                                </v-col>
                            </v-row>
                        </v-scale-transition>
                    </v-card>
                </div>
            </v-slide-group-item>

            <v-slide-group-item>
                <v-card @click="() => {setCreateBankDialogVisible(true)}">
                    <v-row>
                        <v-col cols="12" class="text-center">
                            <v-card-title class="text-h2">
                                <v-col cols="12" class="text-center">
                                    <v-card-title class="text-h2 "> Create </v-card-title>
                                    <v-card-title class="text-h2 ">Bank</v-card-title>
                                </v-col>
                            </v-card-title>
                        </v-col>
                        <v-col cols="12" class="text-center">
                            <v-card-subtitle class="text-h2"></v-card-subtitle>
                        </v-col>
                    </v-row>
                </v-card>
            </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
</template>
<style>
  .custom-chip {
    position: absolute !important;
    top: 10px;
    right: 10px;
    z-index: 9999;
  }
</style>
<script>
import { traceMyMoneyStore } from "@/stores/traceMyMoneyStore";
import { mapActions, mapState } from 'pinia'

export default {
    data() {
        return  {
            model: 0
        }
    },
    computed: {
        ...mapState(traceMyMoneyStore, [
            "getBanksList",
        ])
    },
    methods: {
        ...mapActions(traceMyMoneyStore, [
            "setCreateBankDialogVisible",
            "fetchFilteredExpensesList",
            "deleteBank"
        ]),
        handleBankClick(bank) {
            this.fetchFilteredExpensesList(bank)
        },
        deleteBankSoft(bankId) {
            if (confirm("Do you really want to delte this bank ?")) {
                this.deleteBank(bankId)
            }
        }
    },
}
</script>
