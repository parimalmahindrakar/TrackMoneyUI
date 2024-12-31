<template>
    <v-alert
        dismissible
        color="red"
        border="left"
        elevation="2"
        colored-border
        closable
        :class="[
            'v_alert_changes',
            'w-lg-25',
            'w-80',
            { 'make-opacity': getShowAlert }
        ]"
        v-for="(alertMessage, index) in getAlertErrorMessages"
        :key="index"
    >
        {{ alertMessage }}
    </v-alert>
</template>
<script>
import { traceMyMoneyStore } from "@/stores/traceMyMoneyStore";
import { mapState } from 'pinia'

export default {
    computed: {
        ...mapState(traceMyMoneyStore, [
            "getShowAlert",
            "getAlertErrorMessages"
        ])
    }
}
</script>
