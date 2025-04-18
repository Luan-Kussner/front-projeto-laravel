<template>
  <section class="w-full">
    <BaseForm
      :title="titlePage"
      :register="registerClient"
      :update="updateClient"
      :disabledSendBtn="disabledSendBtn"
      :loadingRequest="isLoading"
    >
      <template v-slot:form>
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

        <div class="flex flex-col justify-start items-start">
          <label for="" class="test-start">Nome</label>
          <input
            type="text"
            class="w-full  p-2 rounded-md outline-0 border focus:border-b-emerald-400"
            placeholder="Informe o nome do cliente"
            v-model="nome"
            :disabled="isLoading"
          />
        </div>

        <div class="flex flex-col justify-start items-start mt-5">
          <label for="" class="test-start">telefone</label>
          <input
            type="text"
            class="w-full p-2 rounded-md outline-0 border focus:border-b-emerald-400"
            placeholder="Informe o Telefone"
            v-model="telefone"
            :disabled="isLoading"
          />
        </div>

        <div class="flex flex-col justify-start items-start mt-5">
          <label for="" class="test-start">Endereço</label>
          <input
            type="text"
            class="w-full p-2 rounded-md outline-0 border focus:border-b-emerald-400"
            placeholder="Informe o Endereço"
            v-model="endereco"
            :disabled="isLoading"
          />
        </div>

        <div class="flex flex-col justify-start items-start mt-5">
          <label for="" class="test-start">Número</label>
          <input
            type="text"
            class="w-full p-2 rounded-md outline-0 border focus:border-b-emerald-400"
            placeholder="Informe o Número do endereço"
            v-model="numero"
            :disabled="isLoading"
          />
        </div>

        <div class="flex flex-col justify-start items-start mt-5">
          <label for="" class="test-start">Bairro</label>
          <input
            type="text"
            class="w-full p-2 rounded-md outline-0 border focus:border-b-emerald-400"
            placeholder="Informe o Bairro"
            v-model="bairro"
            :disabled="isLoading"
          />
        </div>

      </template>
    </BaseForm>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import BaseForm from "@/components/BaseForm/Main.vue";
import api from "@/services/Api";
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const idUpdate = computed(() => route.params.id);
const isLoading = ref(false);
const nome = ref("");
const telefone = ref("");
const endereco = ref("");
const numero = ref("");
const bairro = ref("");

onMounted(() => {
  if (idUpdate.value != "novo") {
    getClientBy();
  }
});

const disabledSendBtn = computed(() => nome.value == "");
const titlePage = computed(() =>
  idUpdate.value == "novo" ? "Cadastrar novo cliente" : "Editar cliente"
);

const registerClient = async () => {
  try {
    isLoading.value = true;

    const formData = new FormData();
    formData.append("nome", nome.value);
    formData.append("telefone", telefone.value);
    formData.append("endereco", endereco.value);
    formData.append("numero", numero.value);
    formData.append("bairro", bairro.value);
    if (objectkey.value) {
      formData.append("objectkey", objectkey.value);
    }

    const { status } = await api.post(`/clientes`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (status == 201) {
      Swal.fire({
        icon: "success",
        title: "Cadastrado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });

      nome.value = telefone.value = endereco.value = numero.value = bairro.value = "";
      objectkey.value = null;
      previewImage.value = null;

      router.back();
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

const objectkey = ref(null);
const previewImage = ref(null);

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    objectkey.value = file;
    previewImage.value = URL.createObjectURL(file); 
  }
};

const updateClient = async () => {
  try {
    isLoading.value = true;

    const formData = new FormData();
    formData.append("nome", nome.value);
    formData.append("telefone", telefone.value);
    formData.append("endereco", endereco.value);
    formData.append("numero", numero.value);
    formData.append("bairro", bairro.value);
    if (objectkey.value) {
      formData.append("objectkey", objectkey.value);
    }
    const { status } = await api.post(`/clientes/${idUpdate.value}?_method=PUT`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (status === 200) {
      Swal.fire({
        icon: "success",
        title: "Atualizado com sucesso!",
        showConfirmButton: false,
        timer: 1500,
      });

      nome.value = telefone.value = endereco.value = numero.value = bairro.value = "";
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

const getClientBy = async () => {
  try {
    isLoading.value = true;
    const { data } = await api.get(`/clientes/${idUpdate.value}`);
    if (data) {
      nome.value     = data.nome;
      telefone.value = data.telefone;
      endereco.value = data.endereco;
      numero.value   = data.numero;
      bairro.value   = data.bairro;
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

<style lang="scss" scoped></style>
