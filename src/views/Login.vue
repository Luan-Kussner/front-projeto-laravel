<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Senha" required />
        <button type="submit">Entrar</button>
      </form>
      <p>Ainda não tem conta? <router-link to="/register">Registre-se</router-link></p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
      }
    },
    methods: {
      async handleLogin() {
        // aqui tenho q incluir chamada para o backend
        console.log('Tentando logar com', this.email, this.password)
      },
    },
  }
  </script>
  