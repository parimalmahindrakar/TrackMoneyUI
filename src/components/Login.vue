<template>
  <v-sheet class="w-xl-25 w-lg-50 w-md-75 w-100" elevation=5 rounded>
    <v-card class="mx-auto px-6 py-8">
      <!-- Add the rules for the both username and password -->
      <v-text-field
        label="Enter your username"
        prepend-inner-icon="mdi-account-circle"
        variant="outlined"
        v-model="userName"
      ></v-text-field>
      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        label="Enter your password"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
        v-model="password"
      ></v-text-field>
      <br>
      <v-btn
        :loading="loading"
        color="success"
        size="large"
        type="submit"
        variant="elevated"
        block
        @click="loginUserSoft"
      >
        Sign In
      </v-btn>
    </v-card>
  </v-sheet>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { traceMyMoneyStore } from '@/stores/traceMyMoneyStore';
import { reactive } from 'vue';

export default {
  name: "Login",
  data() {
    return  {
      visible: false,
      userName: reactive(''),
      password: reactive('')
    }
  },
  methods: {
    ...mapActions(traceMyMoneyStore, [
      "loginUser"
    ]),
    loginUserSoft() {
      if (this.userName !== '' && this.password !== '') {
        this.loginUser({
          "username": this.userName,
          "password": this.password
        })
      }
    }
  }
}
</script>
