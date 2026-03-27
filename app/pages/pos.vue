<script setup>
import ProductFilter from "~/components/pos/ProductFilter.vue";
import Cart from "~/components/pos/Cart.vue";
import ProductGrid from "~/components/pos/ProductGrid.vue";
import WeighScale from "~/components/pos/WeighScale.vue";
import CheckoutModal from "~/components/pos/CheckoutModal.vue";
import ReceiptModal from "~/components/pos/ReceiptModal.vue";
import { useStock } from "~/composables/useStock";

const router = useRouter();
const cart = ref([]);
const { deductStock } = useStock();

const filters = ref({
  search: "",
  category: "all",
});

const showWeighScale = ref(false);
const weighingProduct = ref(null);
const showCheckout = ref(false);
const showReceipt = ref(false);
const currentTransaction = ref(null);
const currentBranch = ref(null);

// Get selected branch
onMounted(() => {
  const savedBranch = localStorage.getItem("selectedBranch");
  if (savedBranch) {
    currentBranch.value = JSON.parse(savedBranch);
  } else {
    router.push("/");
  }
});

function switchBranch() {
  router.push("/");
}

function updateFilters(f) {
  filters.value = f;
}

function addToCart(product) {
  const existing = cart.value.find((p) => p.id === product.id);

  if (existing) {
    existing.qty++;
  } else {
    cart.value.push({ ...product, qty: 1 });
  }
}

function handleWeigh(product) {
  weighingProduct.value = product;
  showWeighScale.value = true;
}

function confirmWeight(weightData) {
  const existing = cart.value.find(
    (p) => p.id === weightData.id && p.weight === weightData.weight,
  );

  if (existing) {
    existing.qty++;
  } else {
    cart.value.push({
      ...weightData,
      qty: 1,
      name: `${weightData.name} (${weightData.weight}g)`,
      price: weightData.totalPrice,
    });
  }

  showWeighScale.value = false;
  weighingProduct.value = null;
}

function removeFromCart(id) {
  cart.value = cart.value.filter((p) => p.id !== id);
}

function handleCheckout() {
  showCheckout.value = true;
}

function confirmPayment(paymentData) {
  // Deduct stock
  const result = deductStock(currentBranch.value.id, cart.value);
  
  if (!result.success) {
    alert(result.message);
    return;
  }

  currentTransaction.value = {
    ...paymentData,
    items: [...cart.value],
    date: new Date(),
  };

  cart.value = [];
  showCheckout.value = false;
  showReceipt.value = true;
}

function closeReceipt() {
  showReceipt.value = false;
  currentTransaction.value = null;
}

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.qty, 0),
);
</script>

<template>
  <div
    class="h-screen bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-green-50/30 flex"
  >
    <!-- LEFT SIDE - Products Area -->
    <div class="w-2/3 p-6 flex flex-col gap-6 overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1
                class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
              >
                Warung Sayur
              </h1>
              <span
                v-if="currentBranch"
                class="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full"
              >
                {{ currentBranch.name.split(' - ')[1] || currentBranch.name }}
              </span>
            </div>
            <p class="text-gray-500 mt-1 text-sm">{{ currentBranch?.address }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <span class="text-sm text-gray-500">Item dalam keranjang:</span>
            <span class="ml-2 text-lg font-bold text-emerald-600">{{
              cart.length
            }}</span>
          </div>
          <button
            @click="router.push('/stock')"
            class="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl shadow-sm border border-gray-200 transition-all duration-200 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            Stok
          </button>
          <button
            @click="switchBranch"
            class="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl shadow-sm border border-gray-200 transition-all duration-200 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Ganti Cabang
          </button>
        </div>
      </div>

      <!-- Filter Section -->
      <ProductFilter @change="updateFilters" />

      <!-- Scanner Section (commented out) -->
      <!-- <Scanner @scan="addToCart" /> -->

      <!-- Product Grid -->
      <div class="flex-1 overflow-y-auto">
        <ProductGrid :filters="filters" @add="addToCart" @weigh="handleWeigh" />
      </div>
    </div>

    <!-- RIGHT SIDE - Cart Area -->
    <div class="w-1/3 p-6">
      <div
        class="h-full bg-white shadow-xl shadow-gray-200/50 rounded-2xl p-6 border border-gray-100"
      >
        <Cart :items="cart" :total="total" @remove="removeFromCart" @checkout="handleCheckout" />
      </div>
    </div>

    <!-- Weigh Scale Modal -->
    <WeighScale
      v-if="showWeighScale && weighingProduct"
      :product="weighingProduct"
      :price-per-kg="weighingProduct.price"
      @confirm="confirmWeight"
      @cancel="
        () => {
          showWeighScale = false;
          weighingProduct = null;
        }
      "
    />

    <!-- Checkout Modal -->
    <CheckoutModal
      v-if="showCheckout"
      :items="cart"
      :total="total"
      @close="showCheckout = false"
      @confirm="confirmPayment"
    />

    <!-- Receipt Modal -->
    <ReceiptModal
      v-if="showReceipt && currentTransaction"
      :transaction="currentTransaction"
      :branch="currentBranch"
      @close="closeReceipt"
    />
  </div>
</template>
