import { defineStore } from "pinia";
import axios from "axios";

export const useChartStore = defineStore("chartStore", {
  state: () => ({
    salesData: [],
    labels: [],
    tagIdNameMappedData: [],
    TM_BACKEND_URL: import.meta.env.VITE_TM_BACKEND_URL,
  }),
  getters: {
    getSalesData: (state) => state.salesData,
    getLabels: (state) => state.labels,
    getTagIdNameMappedData: (state) => state.tagIdNameMappedData,
  },
  actions: {
    async updateSalesData() {
      const res = await axios.get(`${this.TM_BACKEND_URL}expenses/graph-data`)
      if (res.status == 200) {
        this.salesData = Object.values(res.data.aggregated_data).map(ele => ele.tags_wise_summation);
        this.labels = Object.values(res.data.aggregated_data).map(ele => ele.tag_name)
      }
    },
  },
});
