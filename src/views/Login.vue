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
  import api from "../services/Api";
  import toast from "../services/Toast";
  
  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await api.post('login', {
            email: this.email,
            password: this.password,
          });
  
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
  
          toast.success('Login realizado com sucesso!');
          this.$router.push('/dashboard');
        } catch (error) {
          console.error('Erro ao logar:', error.response?.data || error.message);
          toast.error('Erro ao fazer login.');
        }
      },
    },
  };
  </script>
  