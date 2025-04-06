<template>
  <div class="dashboard-container">
    <h2>Bem-vindo à Dashboard!</h2>
    <p>Você está logado como <strong>{{ user?.name }}</strong>.</p>
    <button @click="logout">Sair</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
    };
  },
  created() {
    const userStorage = localStorage.getItem('user');
    if (userStorage) {
      this.user = JSON.parse(userStorage);
    } else {
      this.$router.push('/login'); 
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  text-align: center;
}
</style>
