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

export const getDateRange = (rangeType) => {
  const now = new Date();
  let startDate, endDate;

  switch (rangeType) {
    case 'mtd':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
      break;
    case 'ytd':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = now;
      break;
    case 'last_month':
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      startDate = lastMonth;
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case 'current_week':  // This Week
      const startOfCurrentWeek = new Date(now); // Create a fresh date object to preserve `now`
      startOfCurrentWeek.setDate(now.getDate() - now.getDay()); // Set to Sunday of current week
      startDate = startOfCurrentWeek;
      endDate = now;
      break;
    case 'last_week':  // Last Week
      const startOfLastWeek = new Date(now); // Create a fresh date object for last week
      startOfLastWeek.setDate(now.getDate() - now.getDay() - 7); // Set to Sunday of last week
      const endOfLastWeek = new Date(now); // Create a new Date object for the end of last week
      endOfLastWeek.setDate(now.getDate() - now.getDay()); // Set to Sunday of this week
      startDate = startOfLastWeek;
      endDate = endOfLastWeek;
      break;

    default:
      throw new Error('Invalid date range type');
  }
  const formatDate = (d) => `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} 00:00`;

  return {
    start_date: formatDate(startDate),
    end_date: formatDate(endDate)
  };
};

export const handleError = (err) => {
  console.log(err)
  let pushToData = null;
  if (err.status == 401) {
      if (localStorage.getItem("access_token")) {
          localStorage.removeItem("access_token")
          pushToData = "Please login again !"
      }
      fetchAccessToken()
  } else if(err.status == 400){
    pushToData = err?.response?.data?.error
    if (Array.isArray(err?.response?.data?.errors)) {
      const errorResponse = err?.response?.data?.errors[0]
      const errorResponseMessage = Object.keys(errorResponse)
              .map(field => `${field.charAt(0).toUpperCase() + field.slice(1)}: ${errorResponse[field]}`)
              .join(", ")
      pushToData = errorResponseMessage
    }
  } else {
      pushToData = err?.message
  }
  return pushToData
}
