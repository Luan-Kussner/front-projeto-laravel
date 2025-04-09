<template>
  <div class="login-container">
    <div class="login-image"></div>
    <div class="login-box">
      <h2>Entrar</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Senha" required />
        <button type="submit">Entrar</button>
      </form>
      <p class="register-text">
        Ainda não tem conta?
        <router-link to="/register">Registre-se</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from "../services/Api";

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
        const response = await api.post('/login', {
          email: this.email,
          password: this.password,
        });

        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        this.$router.push('/dashboard');
      } catch (error) {
        alert('Erro ao logar. Verifique suas credenciais.');
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.login-image {
  flex: 1;
  background-image: url('/fundo-login.jpg');
  background-size: cover;
  background-position: center;
}


.login-box {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 100px;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.login-box h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.login-box input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border 0.3s;
}

.login-box input:focus {
  border-color: #3498db;
}

.login-box button {
  width: 100%;
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-box button:hover {
  background-color: #2980b9;
}

.register-text {
  margin-top: 15px;
  font-size: 14px;
  color: #555;
}

.register-text a {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}

.register-text a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }

  .login-image {
    display: none;
  }

  .login-box {
    flex: none;
    width: 100%;
    height: 100vh;
  }
}
</style>
