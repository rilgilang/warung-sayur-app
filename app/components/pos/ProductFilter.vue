<script setup>
const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      search: "",
      category: "all",
    }),
  },
});

const emit = defineEmits(["change"]);

function updateSearch(value) {
  emit("change", {
    search: value,
    category: props.filters?.category || "all",
  });
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
    <!-- Search Bar -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        :value="filters?.search || ''"
        @input="updateSearch($event.target.value)"
        type="text"
        placeholder="Cari produk..."
        class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all duration-200"
      />
      <!-- Clear button -->
      <button
        v-if="filters?.search"
        @click="updateSearch('')"
        class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>
