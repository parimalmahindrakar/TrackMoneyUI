import { defineStore } from 'pinia';
import axios from "axios";
import { fetchAccessToken } from '@/helper/helper';

export const traceMyMoneyStore = defineStore("traceMyMoney", {
    state: () => ({
        userName: null,
        isLoggedIn: false,
        banksList: [],
        expensesList: [],
        filteredExpensesList: [],
        expenseEntriesList: [],
        entryTags: [],
        newEntryTag: null,
        selectedBank: '',
        bankItems: [],
        initialExpenseEntriesList: [],
        expenseEntryCreationDate: '',
        showLoginPage: true,
        showAlert: false,
        alertErrorMessages: [],
        TM_BACKEND_URL: import.meta.env.VITE_TM_BACKEND_URL,
    }),
    getters: {
        getUserName: (state) => state.userName,
        getLoggedInStatus: (state) => state.isLoggedIn,
        getBanksList: (state) => state.banksList,
        getExpensesList: (state) => state.expensesList,
        getFilteredExpensesList: (state) => state.filteredExpensesList,
        getExpenseEntriesList: (state) => state.expenseEntriesList,
        getEntryTags: (state) => state.entryTags,
        getNewEntryTag: (state) => state.newEntryTag,
        getSelectedBank: (state) => state.selectedBank,
        getBankItems: (state) => state.bankItems,
        getInitialExpenseEntriesList: (state) => state.initialExpenseEntriesList,
        getExpenseEntryCreationDate: (state) => state.expenseEntryCreationDate,
        getLoginPageStatus: (state) => state.showLoginPage,
        getShowAlert: (state) => state.showAlert,
        getAlertErrorMessages: (state) => state.alertErrorMessages
    },
    actions: {
        setUserName(userName) {
            this.userName = userName
        },
        setLoggedInStatus(status) {
            this.isLoggedIn = status
        },
        setLoginPageStatus(status) {
            this.showLoginPage = status
        },
        setFilteredExpensesList(bank) {
            this.filteredExpensesList = this.getExpensesList.filter(ele => ele.bank_name === bank.bankName)
        },
        setShowAlert(status) {
            this.showAlert = status
        },
        setAlertErrorMessages(errorMessages) {
            this.alertErrorMessages = errorMessages
        },
        setExpenseEntryCreationDate(changedDate) {
            this.expenseEntryCreationDate = changedDate
        },
        async getInitialData() {
            const date = new Date()
            this.expenseEntryCreationDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} 00:00`

            const responses = await Promise.all([
                axios.get(`${this.TM_BACKEND_URL}banks/`),
                axios.get(`${this.TM_BACKEND_URL}expenses/`),
                axios.get(`${this.TM_BACKEND_URL}entry-tags/`),
            ]).catch(error => {
                if (error.status == 401) {
                    if (localStorage.getItem("access_token")) {
                        localStorage.removeItem("access_token")
                        this.showAlert = true
                        this.alertErrorMessages.push("Please login")
                    }
                    // token might be expired hence removing if exists
                    fetchAccessToken()
                }
            })
            if(responses){
                this.banksList = responses[0].data?.banks.map(ele => ({
                    "bankName": ele.name,
                    "remainingBalance": ele.current_balance,
                    "bankId": ele.id
                }));
                this.expensesList = responses[1].data?.expenses
                this.entryTags = responses[2].data?.entry_tags.map(ele => ele.name);
                this.filteredExpensesList = this.expensesList
                this.bankItems = this.banksList.map(ele => ({ title: ele.bankName, value: ele.bankId }))
            }
        },
        async deleteExpense(expenseId) {
            const expensesResponse = await axios.delete("expenses/delete",
                {
                    params: {
                        id: expenseId
                    },
                    baseURL: this.TM_BACKEND_URL
                }
            )
            if (expensesResponse.status == 204) {
                window.location.reload()
            }
        },
        async deleteExpenseEnrty(expenseId, expenseEntryId) {
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
        },
        async createNewTag(tagName) {
            const entryTagsResponse = await axios.post("entry-tags/create",
                { "name": tagName },
                { baseURL: this.TM_BACKEND_URL }
            )
            if (entryTagsResponse.status == 201) {
                window.location.reload()
            }
        },
        async submitExpenseEntry(expenseId, expenseEntriesList){
            axios.patch("expenses/add-entry",
                expenseEntriesList,
                {
                    params: {
                        id: expenseId
                    },
                    baseURL: this.TM_BACKEND_URL
                }
            ).then(res => {
                if (res.status ==  201) {
                    window.location.reload()
                }
            })
        },
        async submitExpense(data) {
            axios.post("expenses/create",
                data,
                { baseURL: this.TM_BACKEND_URL }
            ).then(res => {
                if (res.status ==  201) {
                    window.location.reload()
                }
            })
        },
        async loginUser(data) {
            axios.post("login",
                data,
                { baseURL: this.TM_BACKEND_URL }
            ).then(res => {
                localStorage.setItem("access_token", res.data["token"])
                fetchAccessToken()
                location.reload()
            }).catch(err => {

            })
        },
        async registerUser(data) {
            axios.post("register",
                data,
                { baseURL: this.TM_BACKEND_URL }
            ).then(res => {
                if (res.status == 200) {
                    location.reload()
                }
            }).catch(err => {

            })
        },
        logoutUser() {
            localStorage.removeItem("access_token")
            location.reload()
        }
    }
})
