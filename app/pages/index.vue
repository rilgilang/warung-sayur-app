<script setup>
const router = useRouter();

// Demo branches - replace with your actual data/API
const branches = ref([
  {
    id: 1,
    name: "Warung Sayur - Cabang Utama",
    address: "Jl. Raya Sayur No. 123",
    city: "Jakarta Pusat",
    phone: "021-1234-5678",
    status: "open",
    image: "🏪",
  },
  {
    id: 2,
    name: "Warung Sayur - Kemang",
    address: "Jl. Kemang Raya No. 45",
    city: "Jakarta Selatan",
    phone: "021-8765-4321",
    status: "open",
    image: "🏪",
  },
  {
    id: 3,
    name: "Warung Sayur - Kelapa Gading",
    address: "Jl. Boulevard Raya No. 88",
    city: "Jakarta Utara",
    phone: "021-4567-8901",
    status: "closed",
    image: "🏪",
  },
  {
    id: 4,
    name: "Warung Sayur - Puri Indah",
    address: "Jl. Puri Indah Raya No. 12",
    city: "Jakarta Barat",
    phone: "021-2345-6789",
    status: "open",
    image: "🏪",
  },
]);

const selectedBranch = ref(null);
const isLoading = ref(false);

function selectBranch(branch) {
  selectedBranch.value = branch;
}

function confirmBranch() {
  if (!selectedBranch.value) return;

  isLoading.value = true;

  // Store selected branch in localStorage
  localStorage.setItem("selectedBranch", JSON.stringify(selectedBranch.value));

  // Simulate loading
  setTimeout(() => {
    router.push("/pos");
    isLoading.value = false;
  }, 800);
}

// Check if there's a previously selected branch
onMounted(() => {
  const savedBranch = localStorage.getItem("selectedBranch");
  if (savedBranch) {
    selectedBranch.value = JSON.parse(savedBranch);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-100 shadow-sm">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-800">Warung Sayur</h1>
              <p class="text-xs text-gray-500">Sistem Kasir Terpadu</p>
            </div>
          </div>
          <div class="text-sm text-gray-500">
            {{ new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-12">
      <!-- Welcome Section -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
          Pilih Cabang Toko
        </h2>
        <p class="text-gray-600 text-lg">
          Silakan pilih cabang yang sedang Anda tangani saat ini
        </p>
      </div>

      <!-- Branches Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div
          v-for="branch in branches"
          :key="branch.id"
          @click="selectBranch(branch)"
          :class="[
            'relative bg-white rounded-2xl p-6 cursor-pointer transition-all duration-200 border-2',
            selectedBranch?.id === branch.id
              ? 'border-emerald-500 shadow-xl shadow-emerald-200 scale-[1.02]'
              : 'border-gray-100 shadow-sm hover:shadow-lg hover:border-emerald-200'
          ]"
        >
          <!-- Selected Indicator -->
          <div
            v-if="selectedBranch?.id === branch.id"
            class="absolute top-4 right-4 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <!-- Branch Icon -->
          <div class="text-5xl mb-4">{{ branch.image }}</div>

          <!-- Branch Info -->
          <h3 class="text-xl font-bold text-gray-800 mb-2">{{ branch.name }}</h3>
          <p class="text-gray-500 text-sm mb-1">{{ branch.address }}</p>
          <p class="text-gray-500 text-sm mb-3">{{ branch.city }}</p>

          <!-- Status Badge -->
          <div class="flex items-center gap-2">
            <span
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                branch.status === 'open'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              ]"
            >
              <span
                :class="[
                  'w-2 h-2 rounded-full mr-2',
                  branch.status === 'open' ? 'bg-emerald-500' : 'bg-red-500'
                ]"
              ></span>
              {{ branch.status === 'open' ? 'Buka' : 'Tutup' }}
            </span>
          </div>

          <!-- Phone -->
          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {{ branch.phone }}
            </div>
          </div>
        </div>
      </div>

      <!-- Continue Button -->
      <div class="flex justify-center">
        <button
          @click="confirmBranch"
          :disabled="!selectedBranch || isLoading"
          class="px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
        >
          <span v-if="!isLoading">Lanjutkan</span>
          <span v-else class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memuat...
          </span>
        </button>
      </div>

      <!-- Info Card -->
      <div class="mt-12 max-w-2xl mx-auto">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800 mb-1">Informasi</h4>
              <p class="text-sm text-gray-600">
                Pilihan cabang akan disimpan untuk sesi ini. Anda dapat mengganti cabang kapan saja dengan kembali ke halaman ini.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-12 py-6 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} Warung Sayur POS System. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
