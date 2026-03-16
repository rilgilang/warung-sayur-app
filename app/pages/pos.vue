<script setup>
import ProductFilter from "~/components/pos/ProductFilter.vue";
import Cart from "~/components/pos/Cart.vue";
import ProductGrid from "~/components/pos/ProductGrid.vue";
import WeighScale from "~/components/pos/WeighScale.vue";

const cart = ref([]);

const filters = ref({
  search: "",
  category: "all",
});

const showWeighScale = ref(false);
const weighingProduct = ref(null);

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
        <div>
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
          >
            Warung Sayur
          </h1>
          <p class="text-gray-500 mt-1">Kelola pesanan sayuran Anda</p>
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
        <Cart :items="cart" :total="total" @remove="removeFromCart" />
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
  </div>
</template>
