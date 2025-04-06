<template>
    <div class="register-container">
      <h2>Cadastro</h2>
      <form @submit.prevent="handleRegister">
        <input v-model="name" type="text" placeholder="Nome completo" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Senha" required />
        <input v-model="is_admin" type="is_admin" placeholder="Admin" required />
        <button type="submit">Registrar</button>
      </form>
      <p>Já tem conta? <router-link to="/login">Login</router-link></p>
    </div>
  </template>
  
  <script>
  import api from "../services/Api";
  
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        is_admin: 0,
      };
    },
    methods: {
      async handleRegister() {
        try {
          const response = await api.post('register', {
            name: this.name,
            email: this.email,
            password: this.password,
            is_admin: this.is_admin,
          });
  
          console.log('Usuário registrado com sucesso:', response.data);
          // Aqui você pode redirecionar para o login ou exibir um toast de sucesso
        } catch (error) {
          console.error('Erro ao registrar:', error.response?.data || error.message);
          // Aqui você pode exibir um toast de erro
        }
      },
    },
  };
  </script>
  