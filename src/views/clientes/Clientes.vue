<template>
  <div>
    <h2>Lista de Clientes</h2>
    <el-table :data="clientes" style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="nome" label="Nome" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="telefone" label="Telefone" />
    </el-table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from "../../services/Api";

export default {
  setup() {
    const clientes = ref([])

    const carregarClientes = async () => {
      try {
        const response = await api.get('/produtos')
        clientes.value = response.data
      } catch (error) {
        console.error('Erro ao buscar clientes:', error)
      }
    }

    onMounted(() => {
      carregarClientes()
    })

    return { clientes }
  }
}
</script>
