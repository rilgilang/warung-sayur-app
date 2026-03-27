<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
  branch: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "save"]);

const form = ref({
  name: "",
  category: "sayur",
  stock: 0,
  unit: "kg",
  minStock: 10,
  price: 0,
});

const errors = ref({});

onMounted(() => {
  if (props.item) {
    form.value = { ...props.item };
  }
});

function validate() {
  errors.value = {};
  
  if (!form.value.name.trim()) {
    errors.value.name = "Nama produk wajib diisi";
  }
  
  if (form.value.stock < 0) {
    errors.value.stock = "Stok tidak boleh negatif";
  }
  
  if (form.value.price <= 0) {
    errors.value.price = "Harga harus lebih dari 0";
  }
  
  if (form.value.minStock < 0) {
    errors.value.minStock = "Minimum stok tidak boleh negatif";
  }
  
  return Object.keys(errors.value).length === 0;
}

function handleSubmit() {
  if (!validate()) return;
  
  emit("save", { ...form.value });
}

const categories = [
  { value: "sayur", label: "Sayuran" },
  { value: "bumbu", label: "Bumbu" },
];

const units = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "ikat", label: "Ikat" },
  { value: "pcs", label: "Buah (pcs)" },
  { value: "pack", label: "Pack" },
];
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full animate-scale-in">
      <!-- Header -->
      <div class="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">
              {{ item ? 'Edit Produk' : 'Tambah Produk Baru' }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">
              {{ item ? 'Update informasi produk' : 'Isi informasi produk baru' }}
            </p>
          </div>
          <button
            @click="emit('close')"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Form -->
      <div class="p-8 space-y-5">
        <!-- Product Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Nama Produk <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Contoh: Cabai Merah"
            :class="[
              'w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
              errors.name ? 'border-red-300' : 'border-gray-200'
            ]"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
        </div>

        <!-- Category & Unit -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Kategori <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.category"
              class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Satuan <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.unit"
              class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option v-for="u in units" :key="u.value" :value="u.value">
                {{ u.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Stock & Min Stock -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Stok Awal <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="form.stock"
                type="number"
                min="0"
                :class="[
                  'w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
                  errors.stock ? 'border-red-300' : 'border-gray-200'
                ]"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{{ form.unit }}</span>
            </div>
            <p v-if="errors.stock" class="mt-1 text-sm text-red-500">{{ errors.stock }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Minimum Stok <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model.number="form.minStock"
                type="number"
                min="0"
                :class="[
                  'w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
                  errors.minStock ? 'border-red-300' : 'border-gray-200'
                ]"
              />
              <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{{ form.unit }}</span>
            </div>
            <p v-if="errors.minStock" class="mt-1 text-sm text-red-500">{{ errors.minStock }}</p>
          </div>
        </div>

        <!-- Price -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Harga per {{ form.unit }} <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              :class="[
                'w-full pl-12 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
                errors.price ? 'border-red-300' : 'border-gray-200'
              ]"
              placeholder="0"
            />
          </div>
          <p v-if="errors.price" class="mt-1 text-sm text-red-500">{{ errors.price }}</p>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-blue-700">
            Minimum stok digunakan untuk alert ketika stok hampir habis. Status akan berubah menjadi "Stok Rendah" ketika mencapai batas ini.
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="px-8 py-6 bg-gray-50 border-t border-gray-100 flex gap-3 rounded-b-3xl">
        <button
          @click="emit('close')"
          class="flex-1 py-3.5 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
        >
          Batal
        </button>
        <button
          @click="handleSubmit"
          class="flex-1 py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-200"
        >
          {{ item ? 'Simpan Perubahan' : 'Tambah Produk' }}
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
</style>
