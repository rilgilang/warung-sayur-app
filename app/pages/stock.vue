<script setup>
import StockModal from "~/components/stock/StockModal.vue";
import { useStock } from "~/composables/useStock";

const router = useRouter();
const { getStock, addStock, updateStock } = useStock();

const currentBranch = ref(null);
const currentStock = ref([]);
const searchQuery = ref("");
const filterCategory = ref("all");
const showLowStock = ref(false);
const showAddModal = ref(false);
const editingItem = ref(null);

const categories = [
  { value: "all", label: "Semua Kategori" },
  { value: "sayur", label: "Sayuran" },
  { value: "bumbu", label: "Bumbu" },
];

onMounted(() => {
  const savedBranch = localStorage.getItem("selectedBranch");
  if (savedBranch) {
    currentBranch.value = JSON.parse(savedBranch);
    loadStock();
  } else {
    router.push("/");
  }
});

function loadStock() {
  if (currentBranch.value) {
    currentStock.value = getStock(currentBranch.value.id);
  }
}

const filteredStock = computed(() => {
  let filtered = currentStock.value;

  if (filterCategory.value !== "all") {
    filtered = filtered.filter(item => item.category === filterCategory.value);
  }

  if (showLowStock.value) {
    filtered = filtered.filter(item => item.stock <= item.minStock);
  }

  if (searchQuery.value) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return filtered;
});

const lowStockCount = computed(() => {
  return currentStock.value.filter(item => item.stock <= item.minStock).length;
});

const totalStockValue = computed(() => {
  return currentStock.value.reduce((sum, item) => sum + (item.stock * item.price), 0);
});

function goBack() {
  router.push("/pos");
}

function openAddModal() {
  editingItem.value = null;
  showAddModal.value = true;
}

function openEditModal(item) {
  editingItem.value = { ...item };
  showAddModal.value = true;
}

function saveStock(item) {
  if (editingItem.value) {
    // Update existing
    updateStock(currentBranch.value.id, item.id, item);
  } else {
    // Add new
    addStock(currentBranch.value.id, { ...item, id: Date.now() });
  }
  showAddModal.value = false;
  editingItem.value = null;
  loadStock(); // Reload stock data
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              @click="goBack"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Manajemen Stok</h1>
              <p class="text-sm text-gray-500">{{ currentBranch?.name }}</p>
            </div>
          </div>
          <button
            @click="openAddModal"
            class="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-200 flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Produk
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Produk</p>
              <p class="text-2xl font-bold text-gray-800">{{ currentStock.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Stok Rendah</p>
              <p class="text-2xl font-bold" :class="lowStockCount > 0 ? 'text-amber-600' : 'text-gray-800'">{{ lowStockCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Kategori</p>
              <p class="text-2xl font-bold text-gray-800">2</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Nilai Stok</p>
              <p class="text-xl font-bold text-gray-800">Rp {{ totalStockValue.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div class="flex items-center gap-4">
          <div class="relative flex-1">
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari produk..."
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select
            v-model="filterCategory"
            class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option v-for="cat in categories" :key="cat.value" :value="cat.value">
              {{ cat.label }}
            </option>
          </select>
          <label class="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors">
            <input
              v-model="showLowStock"
              type="checkbox"
              class="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
            />
            <span class="text-sm font-medium text-amber-700">Stok Rendah</span>
          </label>
        </div>
      </div>

      <!-- Stock Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Produk</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Kategori</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Stok</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Harga</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Min Stok</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="item in filteredStock"
              :key="item.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <span class="font-semibold text-gray-800">{{ item.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    item.category === 'sayur' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  ]"
                >
                  {{ item.category === 'sayur' ? 'Sayuran' : 'Bumbu' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="font-semibold text-gray-800">{{ item.stock }} {{ item.unit }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-600">Rp {{ item.price.toLocaleString() }}/{{ item.unit }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-gray-600">{{ item.minStock }} {{ item.unit }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                    item.stock <= item.minStock
                      ? 'bg-red-100 text-red-700'
                      : item.stock <= item.minStock * 1.5
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  ]"
                >
                  <span
                    :class="[
                      'w-2 h-2 rounded-full mr-2',
                      item.stock <= item.minStock
                        ? 'bg-red-500'
                        : item.stock <= item.minStock * 1.5
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    ]"
                  ></span>
                  {{ item.stock <= item.minStock ? 'Stok Habis' : item.stock <= item.minStock * 1.5 ? 'Stok Rendah' : 'Aman' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="openEditModal(item)"
                  class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="filteredStock.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center">
                  <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p class="text-gray-500 font-medium">Tidak ada produk</p>
                  <p class="text-gray-400 text-sm mt-1">Tambahkan produk untuk mengelola stok</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Stock Modal -->
    <StockModal
      v-if="showAddModal"
      :item="editingItem"
      :branch="currentBranch"
      @close="() => { showAddModal = false; editingItem = null; }"
      @save="saveStock"
    />
  </div>
</template>
