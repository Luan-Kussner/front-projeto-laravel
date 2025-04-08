<template>
  <div class="login-wrapper">
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
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      console.log('Tentando logar com', this.email, this.password);
      // chamada para backend
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f4f6f8;
}

.login-box {
  background: #fff;
  padding: 40px 30px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
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
</style>
