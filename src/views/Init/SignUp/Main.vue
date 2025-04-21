<template>
  <form class="flex flex-col w-1/2 p-2">
    <div class="text-8xl spicy-rice-regular mb-16 flex justify-center">
      <span class="text-slate-900">Control</span>
      <span class="text-emerald-400">Crud</span>
    </div>

    <div class="mb-5">
      <span>Junte-se a nós e aproveite os melhores produtos.</span>
    </div>

    <input
      type="text"
      placeholder="Nome completo"
      class="mb-3 rounded-md p-2 outline-none border focus:border-b-emerald-400"
      v-model="fullName"
    />

    <input
      type="email"
      placeholder="Email"
      class="mb-3 rounded-md p-2 outline-none border focus:border-b-emerald-400"
      v-model.lazy="email"
    />

    <div
      class="border focus-within:border-b-emerald-400 rounded-md flex mb-3"
    >
      <input
        :type="typeInputPassword"
        placeholder="Senha"
        class="outline-none w-full p-2"
        v-model.lazy="password"
      />
      <button
        v-if="typeInputPassword === 'password'"
        type="button"
        @click="typeInputPassword = 'text'"
        class="p-1"
      >
        <i class="bi bi-eye text-xl"></i>
      </button>

      <button
        v-else
        type="button"
        @click.prevent="typeInputPassword = 'password'"
         class="p-1"
      >
        <i class="bi bi-eye-slash text-xl"></i>
      </button>
    </div>

    <div
      class="border focus-within:border-b-emerald-400  rounded-md flex mb-3"
    >
      <input
        :type="typeInputConfirmPassword"
        placeholder="Confirme sua senha"
        class="outline-none w-full p-2"
        v-model.lazy="confirmPassword"
      />
      <button
        v-if="typeInputConfirmPassword === 'password'"
        type="button"
        @click="typeInputConfirmPassword = 'text'"
         class="p-1"
      >
        <i class="bi bi-eye text-xl"></i>
      </button>

      <button
        v-else
        type="button"
        @click.prevent="typeInputConfirmPassword = 'password'"
         class="p-1"
      >
        <i class="bi bi-eye-slash text-xl"></i>
      </button>
    </div>

    <Transition>
      <div
        v-show="disabledSendBtn"
        class="mb-5 flex justify-center transition-all ease-in-out duration-200"
      >
        <span class="text-red-500"
          >*Todos os campos são obrigatórios para cadastrar</span
        >
      </div>
    </Transition>

    <div class="flex flex-col gap-3">
      <button
        type="button"
        class="bg-emerald-400 text-white rounded-md p-2 flex justify-center"
        @click="register()"
        :disabled="disabledSendBtn || loading"
      >
        <Spinner v-if="loading" :size="'h-6 w-6'" />
        <span v-else>Cadastrar</span>
      </button>

      <button
        type="button"
        class="bg-slate-900 text-white rounded-md p-2"
        @click="emit('styleInit', ''), resetForm()"
      >
        Já tenho conta
      </button>
    </div>
  </form>
</template>
  
<script setup>
import api from "@/services/Api";
import { computed, defineEmits, ref, watch } from "vue";
import toast from "@/services/Toast";
import { validateEmail } from "@/services/Helper";
import Spinner from "@/components/Spinner/Main.vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const emit = defineEmits(["styleInit"]);
const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const typeInputPassword = ref("password");
const typeInputConfirmPassword = ref("password");
const loading = ref(false);
const disabledSendBtn = computed(
  () =>
    !fullName.value ||
    fullName.value.split(" ").length < 2 ||
    !email.value ||
    !realEmail.value ||
    !password.value ||
    !confirmPassword.value ||
    !!passwordNotMatch.value
);

const realEmail = computed(() => validateEmail(email.value));

const passwordNotMatch = computed(
  () =>
    password.value &&
    confirmPassword.value &&
    password.value !== confirmPassword.value
);

watch(email, () => {
  if (email.value && !realEmail.value) {
    toast.error("Email inválido. Preencha corretamente.", {
      autoClose: false,
    });
  }
});

watch([password, passwordNotMatch], () => {
  if (password.value && password.value.length < 8) {
    return toast.error(
      `Senha muito curta. Informe uma senha de pelo menos 8 caracteres.`,
      {
        autoClose: false,
      }
    );
  }

  if (passwordNotMatch.value) {
    return toast.error(`Senha incompativel. Preencha corretamente.`, {
      autoClose: false,
    });
  }
});

const register = async () => {
  try {
    loading.value = true;

    const { data,status } = await api.post("/auth/register", {
      name: fullName.value,
      email: email.value,
      password: password.value,
      is_admin: 0
    });
    console.log(data,status);
    if (status === 201) {
      const tokenOnly = data.token.includes('|') ? data.token.split('|')[1] : data.token;
      localStorage.setItem("@token", tokenOnly);
      toast.success(`Cadastro realizado com sucesso!`, {
        autoClose: 3000,
      });

      emit("styleInit", "");
      resetForm();

      router.push("/");
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  fullName.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>