export const filterValidExpenses = (expenseList) => {
    let validEntries = expenseList.filter(ele => ele.amount && ele.description)
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

    return validEntries
}
