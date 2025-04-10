<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2 class="sidebar-title">Painel</h2>
      <ul>
        <li @click="toggleAdmin">
          <span>Administração</span>
          <ul v-if="showAdmin" class="submenu">
            <li>
              <router-link to="/clientes">Clientes</router-link>
            </li>
            <!-- Adicione mais submenus aqui -->
          </ul>
        </li>
      </ul>
    </aside>

    <!-- Conteúdo principal -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAdmin: false,
    };
  },
  methods: {
    toggleAdmin() {
      this.showAdmin = !this.showAdmin;
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f5f6fa;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background-color: #2c3e50;
  color: white;
  padding: 20px;
}

.sidebar-title {
  font-size: 20px;
  margin-bottom: 20px;
  font-weight: bold;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  cursor: pointer;
  margin-bottom: 10px;
}

.sidebar li span {
  font-weight: 500;
}

.submenu {
  margin-top: 10px;
  margin-left: 10px;
}

.submenu li {
  margin: 5px 0;
}

.submenu a {
  color: #ecf0f1;
  text-decoration: none;
}

.submenu a:hover {
  text-decoration: underline;
}

/* Conteúdo principal */
.main-content {
  flex: 1;
  padding: 30px;
}
</style>
