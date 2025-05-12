<template>
  <section class="w-full">
    <BaseForm
      :title="titlePage"
      :register="registerProduct"
      :update="updateProduct"
      :disabledSendBtn="disabledSendBtn"
      :loadingRequest="isLoading"
    >
      <template v-slot:form>
        <div class="flex flex-col justify-start items-start">
          <label for="" class="text-start">Nome do produto</label>
          <input
            type="text"
            class="w-full p-2 rounded-md outline-none border focus:border-b-emerald-400"
            placeholder="Informe o nome do produto"
            v-model="nome"
            :disabled="isLoading"
          />
        </div>

        <div class="flex flex-col justify-start items-start  mt-5">
          <label for="" class="text-start">Descrição do produto</label>
          <input
            type="text"
            class="w-full p-2 rounded-md outline-none border focus:border-b-emerald-400"
            placeholder="Informe o nome do produto"
            v-model="descricao"
            :disabled="isLoading"
          />
        </div>

        <div class="flex flex-col justify-start items-start mt-5">
          <label for="" class="text-start">Valor</label>
          <input
            type="text"
            class="w-full p-2 rounded-md outline-none border focus:border-b-emerald-400"
            placeholder="Informe o valor do produto"
            v-model.lazy="preco"
            :disabled="isLoading"
            v-money="money"
          />
        </div>

        <div class="flex flex-col justify-start items-start items-start mt-5">
            <label for="" class="text-start">Quantidade disponível</label>
          <input
            type="text"
            class="w-full p-2 rounded-md outline-none border focus:border-b-emerald-400"
            placeholder="Informe a quantidade disponível"
            v-model="estoque"
            :disabled="isLoading"
          />
        </div>

        <div class="flex flex-col justify-start items-start mt-5">
          <label for="" class="test-start">Foto do Cliente</label>
          <input
            type="file"
            accept="image/*"
            class="w-full p-2 rounded-md outline-0 border focus:border-b-emerald-400"
            @change="handleImageUpload"
            :disabled="isLoading"
          />
        </div>
        <!-- Mostrar a imagem atual se tiver -->
        <div v-if="previewImage" class="mt-3">
          <label class="text-start block mb-1">Visualização da Imagem</label>
          <img :src="previewImage" alt="Imagem do cliente" class="max-w-xs rounded-md border" />
        </div>
      </template>
    </BaseForm>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import BaseForm from "@/components/BaseForm/Main.vue";
import api from "@/services/Api";
import { useRoute, useRouter } from "vue-router";
import {
  convertCurrencyToFloat,
  formatMoneyPtBr,
} from "@/services/Helper";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
const idUpdate = computed(() => route.params.id);
const isLoading = ref(false);
const descricao = ref(null);
const preco = ref(null);
const nome = ref(null);
const estoque = ref(null);
const objectkey = ref(null);
const previewImage = ref(null);

const money = ref({
  decimal: ",",
  thousands: ".",
  prefix: "R$ ",
  precision: 2,
  masked: false,
});

const disabledSendBtn = computed(
  () => !descricao.value || !preco.value || !nome.value || !estoque.value
);

const titlePage = computed(() =>
  idUpdate.value == "novo" ? "Cadastrar novo produto" : "Editar produto"
);

onMounted(() => {
  if (idUpdate.value != "novo") {
    getProductById();
  }
});

const registerProduct = async () => {
  try {
    isLoading.value = true;

    const formData = new FormData();
    formData.append("nome", nome.value);
    formData.append("preco", convertCurrencyToFloat(preco.value));
    formData.append("estoque", estoque.value);
    formData.append("descricao", descricao.value);
    if (objectkey.value) {
      formData.append("objectkey", objectkey.value);
    }

    const { status } = await api.post(`/produtos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });


    if (status == 201) {
      Swal.fire({
        icon: "success",
        title: "Cadastrado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });

      descricao.value = null;
      preco.value = null;
      nome.value = null;
      estoque.value = null;
      objectkey.value = null;

      setTimeout(() => {
        return router.back();
      }, 2500);
    }
  } catch (err) {
    if (err?.response && err?.response?.data) {
    let errors = "";
    err.response.data.errors.map((error) => {
      errors += error + "<br />";
    });

    return Swal.fire({
      icon: "error",
      html: errors,
      showConfirmButton: false,
      timer: err.response.data.errors.length > 1 ? 3000 : 2500,
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

const updateProduct = async () => {
  try {
    isLoading.value = true;

    const formData = new FormData();
    formData.append("nome", nome.value);
    formData.append("preco", convertCurrencyToFloat(preco.value));
    formData.append("estoque", estoque.value);
    formData.append("descricao", descricao.value);
    if (objectkey.value) {
      formData.append("objectkey", objectkey.value);
    }
    const { status } = await api.post(`/produtos/${idUpdate.value}?_method=PUT`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (status === 200) {
      Swal.fire({
        icon: "success",
        title: "Atualizado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });

      nome.value = preco.value = estoque.value = descricao.value = "";
      objectkey.value = null;
      previewImage.value = null;

      router.back();
    }
  } catch (err) {
    handleRequestError(err);
  } finally {
    isLoading.value = false;
  }
};

const getProductById = async () => {
  try {
    isLoading.value = true;
    const { data } = await api.get(`/produtos/${idUpdate.value}`);

    if (data) {
      nome.value     = data.nome;
      preco.value = formatMoneyPtBr(data.preco);
      estoque.value = data.estoque;
      descricao.value   = data.descricao;
      previewImage.value = data.objectkey || null; 
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
        timer: err.response.data.errors.length > 1 ? 3000 : 2500,
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

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    objectkey.value = file;
    previewImage.value = URL.createObjectURL(file); 
  }
};

const handleRequestError = (err) => {
  if (err?.response && err?.response?.data) {
    let errors = "";
    err.response.data.errors?.forEach((error) => {
      errors += error.message + "<br />";
    });

    return Swal.fire({
      icon: "error",
      html: errors || "Erro ao processar a requisição.",
      showConfirmButton: false,
      timer: err.response.data.errors?.length > 1 ? 3000 : 2500,
    });
  }

  Swal.fire({
    icon: "error",
    text: "Algo deu errado. Tente novamente.",
    showConfirmButton: false,
    timer: 2500,
  });
};

</script>