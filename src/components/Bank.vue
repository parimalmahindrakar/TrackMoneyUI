<template>
    <v-carousel
        v-model="currentSlide"
        :cycle="false"
        :show-arrows="true"
        :interval="5000"
        height="250"
        class="mb-8"
    >
        <v-carousel-item
        v-for="(bank, index) in getBanksList"
        :key="index"
        >
        <v-card class="pa-4" @click="handleBankClick(bank)" elevation="0">
            <v-row>
            <v-col cols="12" class="text-center">
                <v-card-title class="text-h2">{{ bank.bankName }}</v-card-title>
            </v-col>
            <v-col cols="12" class="text-center">
                <v-card-subtitle class="text-h2">{{ bank.remainingBalance }}</v-card-subtitle>
            </v-col>
            </v-row>
        </v-card>
        </v-carousel-item>
        <v-carousel-item>
        <v-card class="pa-4" @click="() => {setDialogVisible(true)}">
            <v-row>
            <v-col cols="12" class="text-center">
                <v-card-title class="text-h2">
                <v-col cols="12" class="text-center">
                    <v-card-title class="text-h2 ">
                    Create
                    </v-card-title>
                    <v-divider class="w-50 mx-auto"></v-divider>
                    <v-card-title class="text-h2 ">Bank</v-card-title>
                </v-col>
                <v-col cols="12" class="text-center">
                </v-col>
                </v-card-title>
            </v-col>
            <v-col cols="12" class="text-center">
                <v-card-subtitle class="text-h2"></v-card-subtitle>
            </v-col>
            </v-row>
        </v-card>
        </v-carousel-item>
    </v-carousel>
</template>


<script>
import { traceMyMoneyStore } from "@/stores/traceMyMoneyStore";
import { mapActions, mapState } from 'pinia'

export default {
    data() {
        return  {
            currentSlide: 0
        }
    },
    computed: {
        ...mapState(traceMyMoneyStore, [
            "getBanksList",
        ])
    },
    methods: {
        ...mapActions(traceMyMoneyStore, [
            "setDialogVisible",
            "setFilteredExpensesList"
        ]),
        handleBankClick(bank) {
            this.setFilteredExpensesList(bank)
        },
    },
}
</script>
