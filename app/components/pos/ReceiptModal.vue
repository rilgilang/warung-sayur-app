<script setup>
const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "print"]);

const receiptRef = ref(null);

function printReceipt() {
  const printContent = receiptRef.value.innerHTML;
  const printWindow = window.open('', '', 'width=400,height=600');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Struk Pembayaran</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; padding: 20px; }
          .receipt { max-width: 380px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 15px; margin-bottom: 15px; }
          .header h1 { font-size: 18px; margin-bottom: 5px; }
          .header p { font-size: 12px; color: #666; }
          .items { border-bottom: 1px dashed #000; padding-bottom: 15px; margin-bottom: 15px; }
          .item { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
          .item-name { flex: 1; }
          .item-qty { margin: 0 10px; }
          .item-price { text-align: right; }
          .total { text-align: right; font-size: 16px; font-weight: bold; margin-bottom: 15px; }
          .payment-info { border-top: 1px dashed #000; padding-top: 15px; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          ${printContent}
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-800">Pembayaran Berhasil!</h2>
          <button
            @click="emit('close')"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Receipt Content -->
      <div ref="receiptRef" class="p-6">
        <!-- Store Header -->
        <div class="text-center border-b border-dashed border-gray-300 pb-4 mb-4">
          <h1 class="text-lg font-bold text-gray-800 mb-1">Toko Sayur Segar</h1>
          <p class="text-sm text-gray-500">Jl. Raya Sayur No. 123</p>
          <p class="text-sm text-gray-500">Telp: 0812-3456-7890</p>
          <p class="text-xs text-gray-400 mt-2">
            {{ new Date().toLocaleString('id-ID') }}
          </p>
        </div>

        <!-- Items -->
        <div class="border-b border-dashed border-gray-300 pb-4 mb-4">
          <div
            v-for="(item, index) in transaction.items"
            :key="index"
            class="flex justify-between items-start mb-3 text-sm"
          >
            <div class="flex-1">
              <p class="font-semibold text-gray-800">{{ item.name }}</p>
              <p class="text-xs text-gray-500">
                {{ item.qty }}x @ Rp {{ (item.price / item.qty).toLocaleString() }}
              </p>
            </div>
            <p class="font-semibold text-gray-800">
              Rp {{ (item.price * item.qty).toLocaleString() }}
            </p>
          </div>
        </div>

        <!-- Total -->
        <div class="text-right mb-4">
          <p class="text-lg font-bold text-gray-800">
            Total: Rp {{ transaction.total.toLocaleString() }}
          </p>
        </div>

        <!-- Payment Info -->
        <div class="border-t border-dashed border-gray-300 pt-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">Metode Bayar</span>
            <span class="font-semibold text-gray-800">
              {{ transaction.paymentMethod === 'cash' ? 'Tunai' : 'QRIS' }}
            </span>
          </div>
          <div v-if="transaction.paymentMethod === 'cash'" class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">Tunai</span>
            <span class="font-semibold text-gray-800">Rp {{ transaction.cashReceived.toLocaleString() }}</span>
          </div>
          <div v-if="transaction.paymentMethod === 'cash'" class="flex justify-between text-sm">
            <span class="text-gray-600">Kembalian</span>
            <span class="font-semibold text-emerald-600">Rp {{ transaction.change.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-6 text-xs text-gray-500">
          <p>Terima kasih atas kunjungan Anda!</p>
          <p class="mt-1">Barang yang sudah dibeli tidak dapat ditukar</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3 no-print">
        <button
          @click="emit('close')"
          class="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
        >
          Tutup
        </button>
        <button
          @click="printReceipt"
          class="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-200"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Cetak Struk
          </span>
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
