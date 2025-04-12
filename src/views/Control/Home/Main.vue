<template>
  <section class="container mt-3">
    <BaseHome
      title="Vendas"
      icon="bi-basket"
      placeholder="Busque pelo nome do cliente ou descrição do produto"
      :newItem="addNewControl"
      :searchItem="getClientOrProductByName"
       @resetGet="getControls"
    >
      <template v-slot:lista>
        <div
          v-if="isLoading"
          class="w-full bg-white p-2 mb-3 flex justify-center items-center"
        >
          buscando...
        </div>
        <div
          v-else-if="controls.length == 0"
          class="w-full bg-white p-2 mb-3 flex justify-center items-center"
        >
          <i class="bi bi-x-circle"></i> Nenhuma venda cadastrado
        </div>

        <div
          v-else
          v-for="control in controls"
          :key="control.id"
          class="rounded-md bg-white p-2 mb-3 flex justify-between items-center border-l-8 border-slate-500 font-normal"
        >
          <div>
            <div>
              <span class="text-sm text-slate-500">Cliente: </span>
              <span>
                {{ control.client.name }}
              </span>
            </div>

            <div>
              <span
                class="text-sm text-slate-500 me-2 cursor-pointer"
                title="Data da venda"
              >
                <i class="bi bi-calendar3"></i>
              </span>
              <span>
                {{ formatDateTimePtBr(control.createdOn) }}
              </span>
            </div>
          </div>
          <div>
            <div>
              <span class="text-sm text-slate-500">Produto: </span>
              <span>
                {{ control.product.description }}
              </span>
            </div>
            <div>
              <span class="text-sm text-slate-500">Quantidade: </span>
              <span>{{ control.productQuantity }}</span>
            </div>
          </div>
          <div class="text-start">
            <div>
              <span class="text-sm text-slate-500">Unidade: </span>
              <span class="fs-5">
                {{ formatMoneyPtBr(control.product.unitaryValue) }}
              </span>
            </div>
            <div>
              <span class="text-sm text-slate-500"> Total: </span>
              <span class="fs-5">
                {{ formatMoneyPtBr(control.valueControl) }}
              </span>
            </div>
          </div>
          <div>
            <button
              type="button"
              class="text-yellow-500 pe-2 border-e me-2"
              @click="updateControl(control.id)"
            >
              <i class="bi bi-pencil-square"></i> Editar
            </button>
            <button
              type="button"
              class="text-red-600 me-2"
              @click="deleteControl(control.id)"
            >
              <i class="bi bi-trash"></i> Deletar
            </button>
          </div>
        </div>
      </template>
    </BaseHome>

    <Pagination
      v-if="controls.length > 0 && totalPages > 1"
      :pageNumber="pageNumber"
      :totalPages="totalPages"
      :totalItems="totalItems"
      @changePageNumber="pageNumber = $event"
      @changePageSize="pageSize = $event"
    />
  </section>
</template>

<script setup>
import BaseHome from "@/components/BaseHome/Main.vue";
import api from "@/services/Api.js";
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
import { formatMoneyPtBr, formatDateTimePtBr } from "@/services/Helper";
import Pagination from "@/components/Pagination/Main.vue";

const router = useRouter();
const controls = ref([]);
const totalItems = ref(0);
const totalPages = ref(0);
const pageNumber = ref(1);
const pageSize = ref(10);
const isLoading = ref(false);

onMounted(() => {
  getControls();
});

watch(pageNumber, () => {
  getControls();
});

watch(pageSize, () => {
  pageNumber.value = 1;
  getControls();
});

const getClientOrProductByName = async (nameOrdescription) => {
  if (!nameOrdescription) return;

  isLoading.value = true;
  controls.value = [];
  const { data } = await api.get(`/control/${nameOrdescription}`);
  controls.value = data;
  isLoading.value = false;
};

const getControls = async () => {
  try {
    isLoading.value = true;
    controls.value = [];
    const { data } = await api.get(
      `/control?pageNumber=${pageNumber.value}&pageSize=${pageSize.value}`
    );
    if (data) {
      totalItems.value = data.totalItems;
      totalPages.value = data.totalPages;
      pageNumber.value = data.pageNumber;
      controls.value = data.items;
    }
  } catch (err) {
    if (err?.response && err?.response?.data) {
      let errors = "";
      err.response.data.errors.map((error) => {
        errors += error.message + "<br />";
      });

      return Swal.fire({
        icon: "error",
        html: errors,
        showConfirmButton: false,
        timer: err.response.data.errors.lenght > 1 ? 3000 : 2500,
      });
    }

    Swal.fire({
      icon: "error",
      text: "Algo deu errado. Tente novamente",
      showConfirmButton: false,
      timer: 2500,
    });
  } finally {
    isLoading.value = false;
  }
};

const addNewControl = () => {
  router.push({ name: "formControls", params: { id: "novo" } });
};

const updateControl = (idUpdate) => {
  router.push({ name: "formControls", params: { id: idUpdate } });
};

const deleteControl = async (id) => {
  Swal.fire({
    title: "Deletar venda",
    text: "Deseja realmente apagar essa venda?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#34d399",
    cancelButtonColor: "#0f172a",
    confirmButtonText: "Sim",
    cancelButtonText: "Não",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await api.delete(`/control/${id}`);
      Swal.fire({
        icon: "success",
        title: "Venda apagado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });
      getControls();
    }
  });
};
</script>
