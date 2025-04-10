<template>
  <div class="sidebar">
    <el-scrollbar>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical-demo"
        mode="vertical"
        background-color="#2c3e50"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-menu-item index="/teste">
          <el-icon><i class="el-icon-house"></i></el-icon>
          <span slot="title">Clientes</span>
        </el-menu-item>
        <el-menu-item index="/clientes">
          <el-icon><i class="el-icon-truck"></i></el-icon>
          <span slot="title">Clientes</span>
        </el-menu-item>
        <el-menu-item index="/teste">
          <el-icon><i class="el-icon-location"></i></el-icon>
          <span slot="title">Teste</span>
        </el-menu-item>
        <el-menu-item index="/usuarios">
          <el-icon><i class="el-icon-user"></i></el-icon>
          <span slot="title">Usuários</span>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
// Certifique-se que os ícones estão importados corretamente, se estiver usando os do Element Plus
import { ElMenu, ElMenuItem, ElScrollbar, ElIcon } from 'element-plus'
</script>

<style scoped>
.sidebar {
  background-color: #2c3e50;
  color: white;
  height: 100vh;
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.el-scrollbar {
  flex: 1;
  overflow-y: auto;
}

.el-menu-vertical-demo {
  width: 100%;
  border-right: none;
  display: flex;
  flex-direction: column;
}
</style>
