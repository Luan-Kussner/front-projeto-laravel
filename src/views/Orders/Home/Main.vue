<template>
  <section class="container mt-3">
    <table id="tabela-pedidos" class="display" style="width: 100%">
      <thead>
        <tr>
          <th>Cliente ID</th>
          <th>Valor Total</th>
          <th>Status</th>
          <th>Data do Pedido</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pedido in pedidos" :key="pedido.id">
          <td>{{ pedido.cliente_id }}</td>
          <td>R$ {{ pedido.valor_total }}</td>
          <td>{{ pedido.status }}</td>
          <td>{{ formatarData(pedido.data_pedido) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from '@/services/Api'; // atenção à letra maiúscula
import Swal from 'sweetalert2';
import $ from 'jquery';
import 'datatables.net';

const pedidos = ref([]);
const isLoading = ref(false);

const getPedidos = async () => {
  try {
    isLoading.value = true;
    const { data } = await api.get('/pedidos'); 
    pedidos.value = data.items || data;

    nextTick(() => {
      $('#tabela-pedidos').DataTable();
    });

  } catch (err) {
    const mensagem =
      err?.response?.data?.message ||
      'Erro ao carregar pedidos. Tente novamente.';
    Swal.fire({
      icon: 'error',
      text: mensagem,
      showConfirmButton: false,
      timer: 2500,
    });
  } finally {
    isLoading.value = false;
  }
};

const formatarData = (dataIso) => {
  const data = new Date(dataIso);
  return data.toLocaleDateString('pt-BR');
};

onMounted(() => {
  getPedidos();
});
</script>

<style scoped>
/* Estilo opcional para deixar mais bonito */
table.dataTable thead th {
  background-color: #f3f4f6;
}
</style>
