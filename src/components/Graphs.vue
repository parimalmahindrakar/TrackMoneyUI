<template>
  <div style="margin-top: 200px !important;">
    <div class="chart-container bg-grey-darken-4 mx-auto">
      <canvas ref="barChartCanvas"></canvas>
      <v-select
        class="mt-15"
        color="success"
        label="Select the tag"
      >
      </v-select>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import { mapState, mapActions } from "pinia";
import { useChartStore } from "@/stores/chartStore";


export default {
  data() {
    return {
      chartInstance: null,
    };
  },
  computed: {
    ...mapState(useChartStore, ["labels", "salesData"]),
  },
  watch: {
    labels: "updateChart",
    salesData: "updateChart",
  },
  mounted() {
    Chart.register(...registerables);
    this.createBarChart();
  },
  created() {
    this.updateSalesData()
  },
  methods: {
    createBarChart() {
      const ctx = this.$refs.barChartCanvas.getContext("2d");
      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.labels,
          datasets: [
            {
              label: "Sales",
              data: this.salesData,
              backgroundColor: "#4CAF50",
              borderColor: "#388E3C",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: "#fff" },
            },
            x: {
              ticks: { color: "#fff" },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: "#fff",
              },
            },
          },
        },
      });
    },
    updateChart() {
      if (this.chartInstance) {
        this.chartInstance.data.labels = this.labels;
        this.chartInstance.data.datasets[0].data = this.salesData;
        this.chartInstance.update();
      }
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 500px;
  width: 50vw;
}
</style>
