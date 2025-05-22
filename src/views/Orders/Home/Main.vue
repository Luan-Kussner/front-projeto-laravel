<template>
  <section class="container mt-3">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4"  style="margin-left: 65px;">Pedidos</h2>

    <div class="tabela-container">
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
            <td>{{ pedido.cliente.nome }}</td>
            <td>R$ {{ pedido.valor_total }}</td>
            <td>{{ pedido.status_formatado }}</td>
            <td>{{ formatarData(pedido.data_pedido) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import api from '@/services/Api';
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
      $('#tabela-pedidos').DataTable({
        scrollY: '300px',          // Limite de altura com scroll
        scrollCollapse: true,
        paging: true,
        language: {
          "sEmptyTable": "Nenhum dado disponível na tabela",
          "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
          "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
          "sInfoFiltered": "(filtrado de _MAX_ registros no total)",
          "sLengthMenu": "Mostrar _MENU_ registros",
          "sLoadingRecords": "Carregando...",
          "sProcessing": "Processando...",
          "sSearch": "Pesquisar:",
          "sZeroRecords": "Nenhum registro encontrado",
          "oPaginate": {
            "sFirst": "Primeiro",
            "sLast": "Último",
            "sNext": "Próximo",
            "sPrevious": "Anterior"
          },
          "oAria": {
            "sSortAscending": ": ativar para ordenar a coluna de forma crescente",
            "sSortDescending": ": ativar para ordenar a coluna de forma decrescente"
          }
        }
      });
    });

  } catch (err) {
    const mensagem =
      err?.response?.data?.message || 'Erro ao carregar pedidos. Tente novamente.';
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
table.dataTable thead th {
  background-color: #f3f4f6;
}

/* Novo estilo para limitar o tamanho da tabela */
.tabela-container {
  max-width: 1400px;
  margin: 10px auto;
  max-height: 400px;
  overflow-y: auto;
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
}
</style>
