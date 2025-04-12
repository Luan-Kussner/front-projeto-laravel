<template>
  <div class="w-full flex justify-between items-center px-10 mt-5">
    <nav>
      <ul class="flex">
        <!-- First Page Button -->
        <li
          v-show="props.pageNumber > 1"
          class="p-2 bg-white rounded-md shadow-lg me-1 cursor-pointer"
          @click="firstPage"
        >
          <i class="bi bi-chevron-double-left"></i>
        </li>

        <!-- Previous Page Button -->
        <li
          v-show="props.pageNumber > 1"
          class="p-2 bg-white rounded-md shadow-lg me-1 cursor-pointer"
          @click="backPage"
        >
          <i class="bi bi-chevron-left"></i>
        </li>

        <!-- Current Page Number Display -->
        <li
          v-show="props.pageNumber > 1"
          class="p-2 bg-white rounded-md shadow-lg me-1 cursor-pointer"
        >
          {{ props.pageNumber - 1 }}
        </li>

        <!-- Active Current Page -->
        <li class="p-2 bg-white rounded-md shadow-lg me-1 cursor-pointer text-emerald-400 font-bold">
          {{ props.pageNumber }}
        </li>

        <!-- Next Page Number Display -->
        <li
          v-show="props.pageNumber < props.totalPages"
          class="p-2 bg-white rounded-md shadow-lg me-1 cursor-pointer"
          @click="nextPage"
        >
          {{ props.pageNumber + 1 }}
        </li>

        <!-- Next Page Button -->
        <li
          v-show="props.pageNumber < props.totalPages"
          class="p-2 bg-white rounded-md shadow-lg me-1 cursor-pointer"
          @click="nextPage"
        >
          <i class="bi bi-chevron-right"></i>
        </li>

        <!-- Last Page Button -->
        <li
          v-show="props.pageNumber < props.totalPages"
          class="p-2 bg-white rounded-md shadow-lg me-1 cursor-pointer"
          @click="lastPage"
        >
          <i class="bi bi-chevron-double-right"></i>
        </li>
      </ul>
    </nav>

    <!-- Total Items Display -->
    <div class="">Total de itens: {{ props.totalItems }}</div>

    <!-- Page Size Selection -->
    <select
      class="bg-white rounded-md p-1 cursor-pointer"
      style="width: 60px !important"
      v-model="pageSize"
      @change="changePageSize"
    >
      <option :value="10">10</option>
      <option :value="20">20</option>
      <option :value="50">50</option>
    </select>
  </div>
</template>

<script setup>
import { ref } from "vue";

const pageSize = ref(10); // Default value for pageSize
const props = defineProps(["pageNumber", "totalPages", "totalItems"]);
const emits = defineEmits(["changePageNumber", "changePageSize"]);

// Functions to handle pagination
const firstPage = () => {
  emits("changePageNumber", 1);
};

const nextPage = () => {
  let page = props.pageNumber;
  page = parseInt(page + 1);
  emits("changePageNumber", page);
};

const lastPage = () => {
  emits("changePageNumber", props.totalPages);
};

const backPage = () => {
  let page = props.pageNumber;
  page = parseInt(page - 1);
  emits("changePageNumber", page);
};

// Function to change page size
const changePageSize = () => {
  emits("changePageSize", pageSize.value);
};
</script>

<style lang="scss" scoped>
/* You can add custom styling here */
</style>
