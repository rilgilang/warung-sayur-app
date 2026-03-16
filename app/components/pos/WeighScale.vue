<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  pricePerKg: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["confirm", "cancel"]);

const weight = ref(0);
const minWeight = 0;
const maxWeight = 2000; // 2kg max
const step = 5; // 5 gram steps

const totalPrice = computed(() => {
  return Math.round((weight.value / 1000) * props.pricePerKg);
});

function incrementWeight() {
  weight.value = Math.min(weight.value + step, maxWeight);
}

function decrementWeight() {
  weight.value = Math.max(weight.value - step, minWeight);
}

function onWeightInput(value) {
  // Clamp value between min and max
  if (value < minWeight) {
    weight.value = minWeight;
  } else if (value > maxWeight) {
    weight.value = maxWeight;
  } else {
    weight.value = Math.round(value / step) * step; // Round to nearest step
  }
}

function confirmWeight() {
  if (weight.value > 0) {
    emit("confirm", {
      ...props.product,
      weight: weight.value,
      totalPrice: totalPrice.value,
      pricePerKg: props.pricePerKg,
    });
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scale-in">
      <!-- Header -->
      <div class="text-center mb-6">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-3">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-800">{{ product.name }}</h3>
        <p class="text-gray-500 mt-1">Rp {{ pricePerKg.toLocaleString() }} / kg</p>
      </div>

      <!-- Weight Display & Input -->
      <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6 border border-emerald-100">
        <div class="text-center mb-4">
          <p class="text-sm text-gray-500 mb-2">Berat</p>
          <div class="flex items-baseline justify-center gap-2">
            <span class="text-5xl font-bold text-emerald-600">{{ weight }}</span>
            <span class="text-xl text-gray-500">gram</span>
          </div>
        </div>

        <!-- Custom Weight Input -->
        <div class="flex items-center gap-3">
          <div class="relative flex-1">
            <input
              :value="weight"
              @input="onWeightInput($event.target.value)"
              type="number"
              :min="minWeight"
              :max="maxWeight"
              :step="step"
              placeholder="Masukkan berat"
              class="w-full px-4 py-3 text-center text-lg font-semibold bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">gram</span>
          </div>
          <button
            @click="weight = 0"
            class="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-xl transition-all duration-200"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Weight Controls -->
      <div class="flex items-center justify-center gap-4 mb-6">
        <button
          @click="decrementWeight"
          class="w-14 h-14 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-2xl transition-all duration-200 active:scale-95"
        >
          −
        </button>
        
        <input
          v-model.number="weight"
          type="range"
          :min="minWeight"
          :max="maxWeight"
          :step="step"
          class="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
        
        <button
          @click="incrementWeight"
          class="w-14 h-14 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-2xl transition-all duration-200 active:scale-95"
        >
          +
        </button>
      </div>

      <!-- Quick Select Buttons -->
      <div class="grid grid-cols-4 gap-2 mb-6">
        <button
          @click="weight = 100"
          class="py-2 px-3 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-emerald-200"
        >
          100g
        </button>
        <button
          @click="weight = 250"
          class="py-2 px-3 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-emerald-200"
        >
          250g
        </button>
        <button
          @click="weight = 500"
          class="py-2 px-3 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-emerald-200"
        >
          500g
        </button>
        <button
          @click="weight = 1000"
          class="py-2 px-3 rounded-lg bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-emerald-200"
        >
          1kg
        </button>
      </div>

      <!-- Total Price -->
      <div class="bg-gray-50 rounded-xl p-4 mb-6">
        <div class="flex justify-between items-center">
          <span class="text-gray-600">Total Harga</span>
          <span class="text-2xl font-bold text-emerald-600">Rp {{ totalPrice.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <button
          @click="emit('cancel')"
          class="flex-1 py-3.5 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
        >
          Batal
        </button>
        <button
          @click="confirmWeight"
          :disabled="weight === 0"
          class="flex-1 py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
  transition: all 0.2s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
}

input[type="range"]::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
  transition: all 0.2s;
}
</style>
