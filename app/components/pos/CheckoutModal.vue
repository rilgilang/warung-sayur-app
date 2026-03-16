<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["close", "confirm"]);

const paymentMethod = ref("cash"); // 'cash' or 'qris'
const cashReceived = ref(0);
const isProcessing = ref(false);

const change = computed(() => {
  return Math.max(0, cashReceived.value - props.total);
});

const isCashSufficient = computed(() => {
  return cashReceived.value >= props.total;
});

function selectPayment(method) {
  paymentMethod.value = method;
}

function quickCash(amount) {
  cashReceived.value = amount;
}

function processPayment() {
  if (paymentMethod.value === "cash" && !isCashSufficient.value) {
    return;
  }

  isProcessing.value = true;
  
  // Simulate processing
  setTimeout(() => {
    emit("confirm", {
      paymentMethod: paymentMethod.value,
      cashReceived: paymentMethod.value === "cash" ? cashReceived.value : 0,
      change: paymentMethod.value === "cash" ? change.value : 0,
      total: props.total,
      items: props.items,
    });
    isProcessing.value = false;
  }, 1000);
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
      <!-- Header -->
      <div class="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-800">Checkout</h2>
              <p class="text-sm text-gray-500">Selesaikan pembayaran Anda</p>
            </div>
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

      <div class="flex">
        <!-- Left Side - Order Summary -->
        <div class="w-1/2 border-r border-gray-100 p-8 overflow-y-auto max-h-[70vh]">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Ringkasan Pesanan
          </h3>

          <!-- Order Items -->
          <div class="space-y-3 mb-6">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="flex justify-between items-start py-3 border-b border-gray-100 last:border-0"
            >
              <div class="flex-1">
                <p class="font-semibold text-gray-800">{{ item.name }}</p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ item.qty }}x @ Rp {{ (item.price / item.qty).toLocaleString() }}
                  <span v-if="item.weight" class="text-amber-600 font-medium">
                    ({{ item.weight }}g)
                  </span>
                </p>
              </div>
              <p class="font-semibold text-gray-800">Rp {{ (item.price * item.qty).toLocaleString() }}</p>
            </div>
          </div>

          <!-- Total -->
          <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Total Pembayaran</span>
              <span class="text-2xl font-bold text-emerald-600">Rp {{ total.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Right Side - Payment Method -->
        <div class="w-1/2 p-8 overflow-y-auto max-h-[70vh]">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Metode Pembayaran
          </h3>

          <!-- Payment Method Selection -->
          <div class="grid grid-cols-2 gap-3 mb-6">
            <button
              @click="selectPayment('cash')"
              :class="[
                'p-4 rounded-xl border-2 transition-all duration-200',
                paymentMethod === 'cash'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <div class="flex flex-col items-center gap-2">
                <svg class="w-8 h-8" :class="paymentMethod === 'cash' ? 'text-emerald-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span class="font-semibold" :class="paymentMethod === 'cash' ? 'text-emerald-600' : 'text-gray-600'">
                  Tunai
                </span>
              </div>
            </button>

            <button
              @click="selectPayment('qris')"
              :class="[
                'p-4 rounded-xl border-2 transition-all duration-200',
                paymentMethod === 'qris'
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <div class="flex flex-col items-center gap-2">
                <svg class="w-8 h-8" :class="paymentMethod === 'qris' ? 'text-emerald-600' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span class="font-semibold" :class="paymentMethod === 'qris' ? 'text-emerald-600' : 'text-gray-600'">
                  QRIS
                </span>
              </div>
            </button>
          </div>

          <!-- Cash Payment -->
          <div v-if="paymentMethod === 'cash'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Uang Diterima
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
                <input
                  v-model.number="cashReceived"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="0"
                  class="w-full pl-12 pr-4 py-3 text-lg font-semibold bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- Quick Cash Buttons -->
            <div class="grid grid-cols-3 gap-2">
              <button
                @click="quickCash(total)"
                class="py-2 px-3 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-200 hover:border-emerald-200"
              >
                Pas
              </button>
              <button
                @click="quickCash(Math.ceil(total / 1000) * 1000)"
                class="py-2 px-3 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-200 hover:border-emerald-200"
              >
                Bulat
              </button>
              <button
                @click="quickCash(Math.ceil(total / 10000) * 10000)"
                class="py-2 px-3 bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 text-sm font-medium rounded-lg transition-all duration-200 border border-gray-200 hover:border-emerald-200"
              >
                10rb
              </button>
            </div>

            <!-- Change Display -->
            <div v-if="cashReceived > 0" class="bg-gray-50 rounded-xl p-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">Diterima</span>
                <span class="font-semibold">Rp {{ cashReceived.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Kembalian</span>
                <span :class="change >= 0 ? 'text-emerald-600 font-bold text-lg' : 'text-red-500'">
                  Rp {{ change.toLocaleString() }}
                </span>
              </div>
            </div>

            <!-- Warning -->
            <div v-if="cashReceived > 0 && !isCashSufficient" class="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-red-600">Uang yang diterima belum cukup!</p>
            </div>
          </div>

          <!-- QRIS Payment -->
          <div v-if="paymentMethod === 'qris'" class="space-y-4">
            <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div class="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                <!-- Placeholder QR Code - Replace with API call in production -->
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DEMO_QRIS_CODE"
                  alt="QRIS Code"
                  class="w-full h-full object-contain p-4"
                />
              </div>
              <p class="text-center text-sm text-gray-500">
                Scan QR code di atas untuk pembayaran
              </p>
            </div>

            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <svg class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-emerald-700">
                Setelah pembayaran QRIS berhasil, klik "Proses Pembayaran" untuk menyelesaikan transaksi.
              </p>
            </div>
          </div>

          <!-- Process Button -->
          <button
            @click="processPayment"
            :disabled="(paymentMethod === 'cash' && !isCashSufficient) || isProcessing"
            class="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
          >
            <span v-if="!isProcessing">Proses Pembayaran</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          </button>
        </div>
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
