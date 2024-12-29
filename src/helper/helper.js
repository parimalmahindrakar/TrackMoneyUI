import axios from "axios";
import { traceMyMoneyStore } from "@/stores/traceMyMoneyStore";

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

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export const fetchAccessToken = () => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
        axios.defaults.headers.common["x-access-token"] = accessToken
        const parsedData = parseJwt(accessToken);
        if (parsedData) {
            traceMyMoneyStore().setUserName(parsedData["user_name"])
            traceMyMoneyStore().setLoggedInStatus(true)
        }
    } else {
        traceMyMoneyStore().setLoggedInStatus(false)
    }
}

export const toggleMoneyString = (money) => {
    if (money < 0) {
        return `+${Math.abs(money)}`
    }
    return money;
}

