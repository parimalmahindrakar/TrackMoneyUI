<template>
    <v-sheet class="w-xl-25 w-lg-50 w-md-75 w-100" elevation=5 rounded>
      <v-card :class="['mx-auto', 'px-6', 'py-8', {'bg-grey-darken-4': getIsDarkMode}]">
        <!-- Add the rules for the both username and password -->
        <v-text-field
          label="Enter your username"
          color="success"
          prepend-inner-icon="mdi-account-circle"
          variant="outlined"
          v-model="userName"
        ></v-text-field>
        <v-text-field
          label="Enter your email"
          color="success"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="email"
        ></v-text-field>
        <v-text-field
          :append-inner-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visiblePassword ? 'text' : 'password'"
          color="success"
          label="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visiblePassword = !visiblePassword"
          v-model="password"
        ></v-text-field>
        <v-text-field
          :append-inner-icon="visibleConfirmationPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visibleConfirmationPassword ? 'text' : 'password'"
          color="success"
          label="Confirm your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visibleConfirmationPassword = !visibleConfirmationPassword"
          v-model="confirmedPassword"
        ></v-text-field>
        <br>
        <v-btn
          :loading="loading"
          color="success"
          size="large"
          type="submit"
          variant="elevated"
          block
          @click="registerUserSoft"
        >
          Sign Up
        </v-btn>
      </v-card>
    </v-sheet>
  </template>

  <script>
  import { mapActions, mapState } from 'pinia'
  import { traceMyMoneyStore } from '@/stores/traceMyMoneyStore';

  export default {
    name: "Register",
    data() {
      return  {
        visiblePassword: false,
        visibleConfirmationPassword: false,
        userName: '',
        password: '',
        email: '',
        confirmedPassword: ''
      }
    },
    computed: {
      ...mapState(traceMyMoneyStore, [
        "getIsDarkMode"
      ])
    },
    methods: {
      ...mapActions(traceMyMoneyStore, [
        "registerUser"
      ]),
      registerUserSoft() {
        const isPasswordMatched = this.password === this.confirmedPassword
        if (this.userName !== '' && isPasswordMatched && this.email !== '') {
          this.registerUser({
            "username": this.userName,
            "password": this.password,
            "email": this.email
          })
        }
      }
    }
  }
  </script>
