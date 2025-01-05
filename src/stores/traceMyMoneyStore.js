import { defineStore } from 'pinia';
import axios from "axios";
import { fetchAccessToken, getDateRange, handleError } from '@/helper/helper';

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
        isCreateBankDialogVisible: false,
        isApplyEntryTagVisible: false,
        currentTotalExpenses: 0,
        currentSelectedBankId: null,
        pageNumber: 1,
        pageSize: 5,

        // advanced expenses searching variables
        searchSelectedTags: [],
        searchSelectedBanks: [],
        searchEntryKeyword: "",
        searchSelectedDaterange: null,
        searchOperator: "and",
        currentTotalOfExpenses: 0,
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
        getAlertErrorMessages: (state) => state.alertErrorMessages,
        getCreateBankDialogVisible: (state) => state.isCreateBankDialogVisible,
        getApplyEntryTagVisible: (state) => state.isApplyEntryTagVisible,
        getPageNumber: (state) => state.pageNumber,
        getPageSize: (state) => state.pageSize,
        getCurrentTotalExpenses: (state) => state.currentTotalExpenses,
        getSearchOperator: (state) => state.searchOperator,
        getSearchSelectedTags: (state) => state.searchSelectedTags,
        getSearchSelectedBanks: (state) => state.searchSelectedBanks,
        getSearchEntryKeyword: (state) => state.searchEntryKeyword,
        getSearchSelectedDaterange: (state) => state.searchSelectedDaterange,
        getCurrentTotalOfExpenses: (state) => state.currentTotalOfExpenses,
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
        setShowAlert(status) {
            this.showAlert = status
        },
        setAlertErrorMessages(errorMessages) {
            this.alertErrorMessages = errorMessages
        },
        setExpenseEntryCreationDate(changedDate) {
            this.expenseEntryCreationDate = changedDate
        },
        setCreateBankDialogVisible(status) {
            this.isCreateBankDialogVisible = status
        },
        setApplyEntryTagVisible(status) {
            this.isApplyEntryTagVisible = status
        },
        setPageNumber(number) {
            this.pageNumber = number
        },
        setPageSize(size) {
            this.pageSize = size
        },
        setSearchSelectedTags(tags){
            this.searchSelectedTags = tags
        },
        setSearchSelectedBanks(banks){
            this.searchSelectedBanks = banks
        },
        setSearchEntryKeyword(keyword){
            this.searchEntryKeyword = keyword
        },
        setSearchSelectedDaterange(daterange){
            this.searchSelectedDaterange = daterange
        },
        setSearchOperator(operator){
            this.searchOperator = operator
        },
        setCurrentTotalOfExpenses(summation) {
            this.currentTotalOfExpenses = summation
        },
        async getInitialData() {
            if (this.isLoggedIn) {
                const date = new Date()
                this.expenseEntryCreationDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} 00:00`

                try {
                    const banksResponse = await axios.get(`${this.TM_BACKEND_URL}banks/`)
                    if (banksResponse) {
                        this.banksList = banksResponse.data?.banks.map(ele => ({
                            "bankName": ele.name,
                            "remainingBalance": ele.current_balance,
                            "bankId": ele.id
                        }));
                        this.bankItems = this.banksList.map(ele => ({ title: ele.bankName, value: ele.bankId }))
                        this.currentSelectedBankId = this.bankItems[0]?.value
                        if (this.currentSelectedBankId) {
                            const responses = await Promise.all([
                                axios.get(`${this.TM_BACKEND_URL}expenses/`, {
                                    params: {
                                        bank_id: this.currentSelectedBankId
                                    }
                                }),
                                axios.get(`${this.TM_BACKEND_URL}entry-tags/`),
                            ])
                            if(responses){
                                this.expensesList = responses[0].data?.expenses
                                const total_summation_obj = this.expensesList.pop("total_summation")
                                const total_expenses_obj = this.expensesList.pop("total_expenses")
                                this.currentTotalExpenses = total_expenses_obj["total_expenses"]
                                this.currentTotalOfExpenses = total_summation_obj["total_summation"]
                                this.entryTags = responses[1].data?.entry_tags
                                                    .map(ele => ({title: ele.name, value: ele.id}))
                                                    .sort((a, b) => a.title.localeCompare(b.title));
                                this.filteredExpensesList = this.expensesList
                            }
                        }
                    }
                } catch(error) {
                    const pushToData = handleError(error)
                    this.showAlert = true
                    this.alertErrorMessages.push(pushToData)
                }
            }
        },
        async deleteExpense(expenseId) {
            try {
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
            } catch(err) {
                const pushToData = handleError(err)
                this.showAlert = true
                this.alertErrorMessages.push(pushToData)
            }
        },
        async deleteExpenseEnrty(expenseId, expenseEntryId) {
            try {
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
            } catch(err) {
                const pushToData = handleError(err)
                this.showAlert = true
                this.alertErrorMessages.push(pushToData)
            }
        },
        async createNewTag(tagName) {
            try {
                const entryTagsResponse = await axios.post("entry-tags/create",
                    { "name": tagName },
                    { baseURL: this.TM_BACKEND_URL }
                )
                if (entryTagsResponse.status == 201) {
                    window.location.reload()
                }
            } catch(err) {
                const pushToData = handleError(err)
                this.showAlert = true
                this.alertErrorMessages.push(pushToData)
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
            }).catch(err => {
                const pushToData = handleError(err)
                this.showAlert = true
                this.alertErrorMessages.push(pushToData)
            })
        },
        async submitExpense(data) {
            data["created_at"] = this.expenseEntryCreationDate
            axios.post("expenses/create",
                data,
                { baseURL: this.TM_BACKEND_URL }
            ).then(res => {
                if (res.status ==  201) {
                    window.location.reload()
                }
            }).catch(err => {
                const pushToData = handleError(err)
                this.showAlert = true
                this.alertErrorMessages.push(pushToData)
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
                const pushToData = handleError(err)
                this.showAlert = true
                this.alertErrorMessages.push(pushToData)
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
                const pushToData = handleError(err)
                this.showAlert = true
                this.alertErrorMessages.push(pushToData)
            })
        },
        async createBank(data) {
            const updatedData = {
                ...data,
                ...{
                    "current_balance": data["initial_balance"],
                    "total_disbursed_till_now": 0,
                }
            }
            try {
                const response = await axios.post("banks/create",
                    updatedData,
                    { baseURL: this.TM_BACKEND_URL }
                )
                if (response.status == 200) {
                    location.reload()
                }
            } catch(err) {
                const pushToData = handleError(err)
                this.showAlert = true
                this.alertErrorMessages.push(pushToData)
            }
        },
        async deleteBank(bankId) {
            try {
                const expensesResponse = await axios.delete("banks/delete",
                    {
                        params: {
                            bank_id: bankId
                        },
                        baseURL: this.TM_BACKEND_URL
                    }
                )
                if (expensesResponse.status == 204) {
                    window.location.reload()
                }
            } catch(err) {
                const pushToData = handleError(err)
                this.showAlert = true
                this.alertErrorMessages.push(pushToData)
            }
        },
        async applyTagsToExpenseEntry(data) {
            try {
                const response = await axios.patch("expenses/update-entry",
                    data,
                    { baseURL: this.TM_BACKEND_URL }
                )
                if (response.status == 201) {
                    location.reload()
                }
            } catch(err) {
                const pushToData = handleError(err)
                this.showAlert = true
                this.alertErrorMessages.push(pushToData)
            }
        },
        async fetchFilteredExpensesList(bank) {
            try {
                this.currentSelectedBankId = bank.bankId
                const resp = await axios.get(`${this.TM_BACKEND_URL}expenses/`, {
                    params: {
                        "per_page": this.pageSize,
                        "page_number": this.pageNumber,
                        "bank_id": this.currentSelectedBankId
                    }
                })
                if (resp) {
                    this.filteredExpensesList = resp?.data?.expenses
                    this.currentTotalOfExpenses = this.filteredExpensesList.pop("total_summation")["total_summation"]
                    this.currentTotalExpenses = this.filteredExpensesList.pop("total_expenses")["total_expenses"]
                }
            } catch (err) {
                const pushToData = handleError(err)
                this.showAlert = true
                this.alertErrorMessages.push(pushToData)
            }
        },
        async fetchExpenses() {
            try {
                const resp = await axios.get(`${this.TM_BACKEND_URL}expenses/`, {
                    params: {
                        "per_page": this.pageSize,
                        "page_number": this.pageNumber,
                        "bank_id": this.currentSelectedBankId
                    }
                })
                if (resp) {
                    this.filteredExpensesList = resp?.data?.expenses
                    this.currentTotalOfExpenses = this.filteredExpensesList.pop("total_summation")["total_summation"]
                    this.currentTotalExpenses = this.filteredExpensesList.pop("total_expenses")["total_expenses"]
                }
            } catch (err) {
                const pushToData = handleError(err)
                this.showAlert = true
                this.alertErrorMessages.push(pushToData)
            }
        },
        async makeAdvancedExpenseSearch() {
            try {
                const data = {
                    "page_number": this.pageNumber,
                    "per_page": this.pageSize,
                    "operator": this.searchOperator,
                    "advanced_search": true
                }
                if (this.searchSelectedTags?.length > 0) {
                    data["search_by_tags"] = this.searchSelectedTags
                }
                if (this.searchSelectedBanks?.length > 0) {
                    data["search_by_bank_ids"] = this.searchSelectedBanks
                }
                if (this.searchEntryKeyword) {
                    data["search_by_keyword"] = this.searchEntryKeyword
                }
                if (this.searchSelectedDaterange) {
                    data["search_by_daterange"] = getDateRange(this.searchSelectedDaterange)
                }
                const response = await axios.get("expenses/",
                    {
                        baseURL: this.TM_BACKEND_URL,
                        params: {
                            "data": JSON.stringify(data)
                        }
                    }
                )
                if(response.status == 200) {
                    this.filteredExpensesList = response?.data?.expenses
                    this.currentTotalOfExpenses = this.filteredExpensesList.pop("total_summation")["total_summation"]
                    this.currentTotalExpenses = this.filteredExpensesList.pop("total_expenses")["total_expenses"]
                }
            } catch(err) {
                const pushToData = handleError(err)
                this.showAlert = true
                this.alertErrorMessages.push(pushToData)
            }
        },
        logoutUser() {
            localStorage.removeItem("access_token")
            location.reload()
        }
    }
})
