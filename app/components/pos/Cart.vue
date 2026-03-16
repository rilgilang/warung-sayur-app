<script setup>
const props = defineProps({
  items: Array,
  total: Number,
});

const emit = defineEmits(["remove", "checkout"]);
</script>

<template>
  <div class="flex flex-col h-full bg-white rounded-2xl">
    <!-- Header -->
    <div class="px-6 py-5 border-b border-gray-100">
      <h2 class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        Order
      </h2>
    </div>

    <!-- Cart Items -->
    <div class="flex-1 overflow-y-auto px-6 py-4 space-y-3">
      <TransitionGroup
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-2 opacity-0"
      >
        <div
          v-for="item in items"
          :key="item.id"
          class="group flex justify-between items-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-200"
        >
          <div class="flex-1">
            <p class="font-semibold text-gray-800 text-base">
              {{ item.name }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-medium">
                {{ item.qty }}x
              </span>
              <span class="ml-2">{{ item.price }}</span>
              <!-- Weight badge for weighed items -->
              <span
                v-if="item.weight"
                class="ml-2 inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-xs font-medium"
              >
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
                {{ item.weight }}g
              </span>
            </p>
          </div>

          <button
            @click="emit('remove', item.id)"
            class="ml-4 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label="Remove item"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="items.length === 0" class="flex flex-col items-center justify-center h-full text-center py-12">
        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <p class="text-gray-500 font-medium">Belum ada item</p>
        <p class="text-gray-400 text-sm mt-1">Tambah produk untuk memulai</p>
      </div>
    </div>

    <!-- Footer with Total -->
    <div class="px-6 py-5 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white rounded-b-2xl">
      <div class="flex justify-between items-center mb-4">
        <span class="text-gray-600 font-medium">Total</span>
        <span class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          {{ total }}
        </span>
      </div>

      <button
        @click="emit('checkout')"
        :disabled="items.length === 0"
        class="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Checkout
      </button>
    </div>
  </div>
</template>
