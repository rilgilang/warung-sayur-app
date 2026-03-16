<script setup>
import { QrcodeStream } from "vue-qrcode-reader";

const props = defineProps({
  scanned: "sdadsad",
});

const emit = defineEmits(["scan"]);

function onDetect(codes) {
  console.log("Detected codes:", codes[0].format);
  console.log("Detected value:", codes[0].rawValue);
  if (!codes.length) return;

  const barcode = codes[0].rawValue;

  emit("scan", {
    id: barcode,
    name: "Scanned Product",
    price: 10000,
    scanned: barcode, // pass scanned value to parent
  });
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      </div>
      <h2 class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        Scan Produk
      </h2>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <!-- Scanner -->
      <div class="relative">
        <div class="w-full max-w-md rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-100">
          <ClientOnly>
            <QrcodeStream
              :formats="[
                'qr_code',
                'ean_13',
                'ean_8',
                'code_128',
                'upc_a',
                'upc_e',
              ]"
              @detect="onDetect"
            />
          </ClientOnly>
        </div>
        <!-- Decorative corner accents -->
        <div class="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-emerald-500 rounded-tl-lg pointer-events-none"></div>
        <div class="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-emerald-500 rounded-tr-lg pointer-events-none"></div>
        <div class="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-emerald-500 rounded-bl-lg pointer-events-none"></div>
        <div class="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-emerald-500 rounded-br-lg pointer-events-none"></div>
      </div>

      <!-- Scan Result -->
      <div class="flex flex-col justify-center">
        <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
          <div class="flex items-center gap-2 mb-2">
            <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm font-semibold text-emerald-600">Hasil Scan</span>
          </div>
          <p class="text-2xl font-bold text-gray-800 break-all">
            {{ scanned || '—' }}
          </p>
          <p v-if="!scanned" class="text-sm text-gray-400 mt-2">
            Scan barcode untuk melihat hasil
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
