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

        <section class="mt-5">
          <div
            class="intro-y flex flex-col sm:flex-row items-center pb-2 border-b border-slate-200/60 dark:border-darkmode-400"
          >
            <h2 class="">Importe a imagem do produto</h2>
          </div>
          <div>
            <Dropzone
              titleDropzone="Arraste ou clique aqui para importar imagem do produto"
              @onFileUpload="($event) => (listFilesUpload = $event)"
            />
          </div>
        </section>
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
  getExtnsionFile,
  convertCurrencyToFloat,
  formatMoneyPtBr,
} from "@/services/Helper";
import Dropzone from "@/components/Dropzone/Main.vue";
import toast from "@/services/Toast";
import { VMoney } from "v-money";

const route = useRoute();
const router = useRouter();
const idUpdate = computed(() => route.params.id);
const isLoading = ref(false);
const descricao = ref(null);
const preco = ref(null);
const nome = ref(null);
const estoque = ref(null);

const listFilesUpload = ref([]);

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
    const { status, data } = await api.post("/produtos", {
      descricao: descricao.value,
      preco: convertCurrencyToFloat(preco.value),
      nome: nome.value,
      estoque: estoque.value,
    });

    if (status == 201) {
      if (listFilesUpload.value.length > 0) {
        const status = await sendImageProduct(data.id);

        if (status == 200) {
          toast.success("Cadastrado com sucesso!", {
            autoClose: 2500,
          });

          descricao.value = null;
          preco.value = null;

          setTimeout(() => {
            return router.back();
          }, 2500);
        }
      }

      await removeImageProduct(data.id);
      toast.success("Cadastrado com sucesso!", {
        autoClose: 2500,
      });

      descricao.value = null;
      preco.value = null;
      nome.value = null;
      estoque.value = null;

      setTimeout(() => {
        return router.back();
      }, 2500);
    }
  } catch (err) {
    if (err?.response && err?.response?.data) {
      err.response.data.errors.map((error) => {
        return toast.error(error, {
          autoClose: 3500,
        });
      });
    }

    return toast.error("Algo deu errado. Tente novamente.", {
      autoClose: 3500,
    });
  } finally {
    isLoading.value = false;
  }
};

const sendImageProduct = async (id) => {
  const formData = new FormData();

  listFilesUpload.value.forEach((item) => {
    formData.append("File", item);
  });

  formData.append("Id", id);

  try {
    const { status } = await api.post("/product/file", formData);
    return status;
  } catch (err) {
    console.log(err);
  }
};

const removeImageProduct = async (id) => {
  try {
    await api.delete(`/product/file/${id}`);
  } catch (err) {
    console.log(err);
  }
};

const updateProduct = async () => {
  try {
    isLoading.value = true;

    const { status } = await api.put("/product", {
      id: idUpdate.value,
      descricao: descricao.value,
      preco: convertCurrencyToFloat(preco.value),
    });

    if (status == 200) {
      if (listFilesUpload.value.length > 0) {
        try {
          const status = await sendImageProduct(idUpdate.value);

          if (status == 200) {
            toast.success("Atualizado com sucesso!", {
              autoClose: 2500,
            });

            descricao.value = null;
            preco.value = null;

            setTimeout(() => {
              return router.back();
            }, 2500);
          }
        } catch (err) {
          if (err?.response && err?.response?.data) {
            err.response.data.errors.map((error) => {
              return toast.error(error, {
                autoClose: 3500,
              });
            });
          }

          return toast.error("Algo deu errado. Tente novamente.", {
            autoClose: 3500,
          });
        }
      }

      await removeImageProduct(idUpdate.value);

      toast.success("Atualizado com sucesso!", {
        autoClose: 2500,
      });
      descricao.value = null;
      preco.value = null;

      setTimeout(() => {
        return router.back();
      }, 2500);
    }
  } catch (err) {
    if (err?.response && err?.response?.data) {
      err.response.data.errors.map((error) => {
        return toast.error(error, {
                autoClose: 3500,
        });
      });
    }

    return toast.error("Algo deu errado. Tente novamente.", {
      autoClose: 3500,
    });
  } finally {
    isLoading.value = false;
  }
};

const getProductById = async () => {
  try {
    isLoading.value = true;
    const { data } = await api.get(`/product/${idUpdate.value}`);

    if (data) {
      descricao.value = data.descricao;
      preco.value = formatMoneyPtBr(data.preco);

      if (data.pathImage != null) {
        let fileName = data.pathImage.split("/");
        fileName = fileName[fileName.length - 1];

        const result = await api.get(data.pathImage);
        const ext = getExtnsionFile(result.headers["content-type"]);
        const mimeType = result.headers["content-type"];

        const file = await urlToFile(data.pathImage, fileName + ext, mimeType);
        listFilesUpload.value = [file];
      }
    }
  } catch (err) {
    if (err?.response && err?.response?.data) {
      err.response.data.errors.map((error) => {
        return toast.error(error, {
                autoClose: 3500,
              });
      });
    }

    return toast.error("Algo deu errado. Tente novamente.", {
      autoClose: 3500,
    });
  } finally {
    isLoading.value = false;
  }
};

const urlToFile = async (url, filename, mimeType) => {
  // Buscar a imagem
  const response = await fetch(url);
  // Converter a resposta em um Blob
  const blob = await response.blob();
  // Criar um arquivo a partir do Blob
  return new File([blob], filename, { type: mimeType });
};
</script>