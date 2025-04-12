<template>
  <form
    class="uploader w-full intro-y"
    @dragenter.prevent="OnDragEnter"
    @dragleave.prevent="OnDragLeave"
    @dragover.prevent
    @drop.prevent="onDrop"
    enctype="multipart/form-data"
  >
    <div>
      <div class="w-full flex">
        <label
          for="upload"
          class="label-upload w-full p-4 rounded-md text-center"
          :class="{ isDraggingStyle: isDragging }"
        >
          <div class="spinner-custom rounded" v-show="isLoading">
            <span class="text-white"> Importando... </span>
            <span class="text-white fs-12">Isso pode levar alguns minutos</span>
          </div>
          <span>
            {{ titleDropzone }}
            <br />
            <span class="text-sm">
              Aceitamos apenas arquivos '.jpg', '.jpeg' ou '.png'
            </span>
          </span>
          <div class="group-files w-full mt-3">
            <p
              v-for="(file, index) in listFilesUpload"
              :key="index"
              class="p-3 h-52 w-52 my-1 text-base text-slate-600 rounded-md flex flex-col justify-between"
              @click.prevent=""
            >
              <span
                class="nameFile cursor-pointer"
                :title="file.name"
                style="font-size: 18px"
              >
                {{ index + 1 }}. {{ file.name }}
              </span>

              <button
                class="bg-red-500 p-2 rounded-md text-white"
                @click.prevent="removeFile(index)"
              >
                Apagar
              </button>
            </p>
          </div>
        </label>
        <input
          :disabled="isLoading"
          type="file"
          id="upload"
          :accept="acceptTypes"
          @change="onInputChange"
        />
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import toast from "@/services/Toast";

// Reactive references
const isDragging = ref(false);
const dragCount = ref(0);
const listFilesUpload = ref([]);
const acceptTypes = ref([".jpg", ".jpeg", ".png"]);

// Props
const props = defineProps({
  titleDropzone: String,
  isLoading: Boolean
});

// Events
const emit = defineEmits(["onFileUpload"]);

// Handlers for drag and drop
const OnDragEnter = () => {
  dragCount.value++;
  isDragging.value = true;
};

const OnDragLeave = () => {
  dragCount.value--;
  if (dragCount.value <= 0) isDragging.value = false;
};

const onDrop = (e) => {
  const files = e.dataTransfer.files;
  isDragging.value = false;

  [...files].forEach((file) => {
    const ext = file?.name.split(".").pop();
    if (acceptTypes.value.includes("." + ext)) {
      listFilesUpload.value = [file];
      emit("onFileUpload", listFilesUpload.value);
    } else {
      showErrorMessage();
    }
  });
};

// Handle file input change
const onInputChange = (e) => {
  const files = e.target.files;
  [...files].forEach((file) => {
    const ext = file?.name.split(".").pop();
    if (acceptTypes.value.includes("." + ext)) {
      listFilesUpload.value = [file];
      emit("onFileUpload", listFilesUpload.value);
    } else {
      showErrorMessage();
    }
  });
};

// Remove file from list
const removeFile = (index) => {
  listFilesUpload.value.splice(index, 1);
  emit("onFileUpload", listFilesUpload.value);
};

// Show error message for unsupported file types
const showErrorMessage = () => {
  const message = `
    <div class="flex flex-col">
      <h3 class="font-semibold">Tipo de arquivo não suportado!</h3>
      <p>Aceitamos apenas arquivos de extensão '.jpg', '.jpeg' ou '.png'.</p>
    </div>
  `;
  toast.error(message, {
    timer: 3000,
    dangerouslyHTMLString: true,
  });
};
</script>

<style scoped>
/* Add any specific styles for this component */
</style>
