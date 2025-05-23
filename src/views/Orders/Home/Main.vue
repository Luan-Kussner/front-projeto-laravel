<template>
  <section class="container mt-3">
    <h2 class="text-2xl font-semibold text-gray-700 mb-4" style="margin-left: 65px;">Pedidos</h2>

    <!-- Botão Novo -->
    <div class="flex justify-end mb-3" style="margin-right: 65px;">
      <button @click="abrirModalNovo" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Novo Pedido
      </button>
    </div>

    <div class="tabela-container">
      <table id="tabela-pedidos" class="display" style="width: 100%">
        <thead>
          <tr>
            <th>Ações</th>
            <th>Cliente</th>
            <th>Valor Total</th>
            <th>Status</th>
            <th>Data do Pedido</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pedido in pedidos" :key="pedido.id">
            <td>
              <button @click="abrirModalEditar(pedido)" class="text-blue-600 hover:underline mr-2">Editar</button>
              <button @click="removerPedido(pedido.id)" class="text-red-600 hover:underline">Remover</button>
            </td>
            <td>{{ pedido.cliente.nome }}</td>
            <td>R$ {{ pedido.valor_total }}</td>
            <td>{{ pedido.status_formatado }}</td>
            <td>{{ formatarData(pedido.data_pedido) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="modalVisivel" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded w-[400px] relative">
        <h3 class="text-lg font-semibold mb-4">{{ pedidoSelecionado ? 'Editar Pedido' : 'Novo Pedido' }}</h3>
        <!-- Formulário simplificado -->
        <div class="mb-4">
          <label class="block mb-1">Valor Total</label>
          <input v-model="form.valor_total" type="number" class="w-full border px-2 py-1 rounded" />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Status</label>
          <input v-model="form.status" class="w-full border px-2 py-1 rounded" />
        </div>
        <div class="flex justify-end gap-2">
          <button @click="salvarPedido" class="bg-green-600 text-white px-4 py-2 rounded">Salvar</button>
          <button @click="fecharModal" class="bg-gray-300 text-black px-4 py-2 rounded">Cancelar</button>
        </div>
      </div>
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
      const table = $('#tabela-pedidos').DataTable();
      if (table) {
        table.destroy();
      }
      $('#tabela-pedidos').DataTable({
        scrollY: '300px', 
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

const modalVisivel = ref(false);
const pedidoSelecionado = ref(null);
const form = ref({
  valor_total: '',
  status: ''
});

const abrirModalNovo = () => {
  pedidoSelecionado.value = null;
  form.value = { valor_total: '', status: '' };
  modalVisivel.value = true;
};

const abrirModalEditar = (pedido) => {
  pedidoSelecionado.value = pedido;
  form.value = {
    valor_total: pedido.valor_total,
    status: pedido.status
  };
  modalVisivel.value = true;
};

const fecharModal = () => {
  modalVisivel.value = false;
};

const salvarPedido = async () => {
  try {
    if (pedidoSelecionado.value) {
      // Editar
      await api.put(`/pedidos/${pedidoSelecionado.value.id}`, form.value);
    } else {
      // Criar novo
      await api.post('/pedidos', form.value);
    }
    await getPedidos();
    fecharModal();
  } catch (err) {
    Swal.fire({
      icon: 'error',
      text: 'Erro ao salvar pedido.',
      showConfirmButton: false,
      timer: 2000
    });
  }
};

const removerPedido = async (id) => {
  const confirm = await Swal.fire({
    title: 'Remover pedido?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Cancelar'
  });

  if (confirm.isConfirmed) {
    try {
      await api.delete(`/pedidos/${id}`);
      await getPedidos();
    } catch {
      Swal.fire('Erro', 'Erro ao remover o pedido.', 'error');
    }
  }
};
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
