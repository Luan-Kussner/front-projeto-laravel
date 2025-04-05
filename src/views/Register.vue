<template>
    <div class="register-container">
      <h2>Cadastro</h2>
      <form @submit.prevent="handleRegister">
        <input v-model="name" type="text" placeholder="Nome completo" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Senha" required />
        <button type="submit">Registrar</button>
      </form>
      <p>Já tem conta? <router-link to="/login">Login</router-link></p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
      }
    },
    methods: {
      async handleRegister() {
        // aqui tenho q incluir chamada para o backend
        console.log('Registrando:', this.name, this.email, this.password)
      },
    },
  }
  </script>
  