<template>
    <v-app-bar scroll-behavior="hide">
      <v-container class="w-lg-75 w-100">
        <div class="d-flex w-lg-75 mx-auto justify-space-between align-center">
          <span class="text-sm-h5 text-md-h4 text-h6">
            Trace My Money
          </span>
          <span>
            <span v-if="getLoggedInStatus">
              Hello, {{ getUserName }}
              <span
                color="primary"
                class="cursor-pointer"
              >
                <v-icon
                  icon="mdi-logout"
                  end
                  @click="logoutUser"
                ></v-icon>
              </span>
            </span>
            <div v-else>
              <v-btn-toggle
                color="success"
                v-model="toggleLogin"
                class="custom-btn-toggle"
              >
                <v-btn @click="() => { setLoginPageStatus(true) }" class="custom-btn">Login</v-btn>
                <v-btn @click="() => { setLoginPageStatus(false) }" class="custom-btn">Register</v-btn>
              </v-btn-toggle>
            </div>
          </span>
        </div>
      </v-container>
    </v-app-bar>
</template>

<script>
import { traceMyMoneyStore } from "@/stores/traceMyMoneyStore";
import { mapActions, mapState } from 'pinia'

export default {
    data() {
      return {
        toggleLogin: 0,
      }
    },
    computed: {
      ...mapState(traceMyMoneyStore, [
        "getUserName",
        "getLoggedInStatus",
      ])
    },
    methods: {
      ...mapActions(traceMyMoneyStore, [
        "logoutUser",
        "setLoginPageStatus",
      ]),
    }
}
</script>
