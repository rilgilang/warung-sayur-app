<script setup>
const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      search: "",
      category: "all",
    }),
  },
});

const emit = defineEmits(["add", "weigh"]);

const products = ref([
  {
    id: 1,
    name: "Bayam",
    price: 5000,
    category: "sayur",
    type: "packaged",
    unit: "ikat",
  },
  {
    id: 2,
    name: "Kangkung",
    price: 4000,
    category: "sayur",
    type: "packaged",
    unit: "ikat",
  },
  {
    id: 3,
    name: "Sawi Hijau",
    price: 6000,
    category: "sayur",
    type: "packaged",
    unit: "ikat",
  },
  {
    id: 4,
    name: "Wortel",
    price: 8000,
    category: "sayur",
    type: "weigh",
    unit: "kg",
  },
  {
    id: 5,
    name: "Tomat",
    price: 7000,
    category: "sayur",
    type: "weigh",
    unit: "kg",
  },
  {
    id: 6,
    name: "Terong",
    price: 6000,
    category: "sayur",
    type: "weigh",
    unit: "kg",
  },
  {
    id: 7,
    name: "Timun",
    price: 5000,
    category: "sayur",
    type: "weigh",
    unit: "kg",
  },
  {
    id: 8,
    name: "Cabai Merah",
    price: 15000,
    category: "bumbu",
    type: "weigh",
    unit: "kg",
  },
  {
    id: 9,
    name: "Cabai Rawit",
    price: 18000,
    category: "bumbu",
    type: "weigh",
    unit: "kg",
  },
  {
    id: 10,
    name: "Bawang Merah",
    price: 12000,
    category: "bumbu",
    type: "weigh",
    unit: "kg",
  },
  {
    id: 11,
    name: "Bawang Putih",
    price: 10000,
    category: "bumbu",
    type: "weigh",
    unit: "kg",
  },
  {
    id: 12,
    name: "Jahe",
    price: 9000,
    category: "bumbu",
    type: "weigh",
    unit: "kg",
  },
]);

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const search = props.filters?.search?.toLowerCase() || "";
    const category = props.filters?.category || "all";

    const matchSearch = p.name.toLowerCase().includes(search);
    const matchCategory = category === "all" || p.category === category;

    return matchSearch && matchCategory;
  });
});

function handleProductClick(product) {
  if (product.type === "weigh") {
    emit("weigh", product);
  } else {
    emit("add", product);
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between mb-5">
      <h2
        class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
      >
        Produk Sayur
      </h2>
      <span class="text-sm text-gray-500">
        {{ filteredProducts.length }} item{{
          filteredProducts.length !== 1 ? "s" : ""
        }}
      </span>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="p in filteredProducts"
        :key="p.id"
        @click="handleProductClick(p)"
        class="group relative border border-gray-100 rounded-xl p-5 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-200 hover:shadow-lg transition-all duration-200 cursor-pointer text-left"
      >
        <!-- Type Badge -->
        <div class="absolute top-3 right-3">
          <span
            v-if="p.type === 'weigh'"
            class="px-2 py-1 text-xs font-semibold rounded-md bg-amber-100 text-amber-700"
          >
            <svg
              class="w-3 h-3 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
              />
            </svg>
            Timbang
          </span>
        </div>

        <!-- Product Icon -->
        <div
          class="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200"
        >
          <svg
            class="w-5 h-5 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </div>

        <p
          class="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-200 pr-16"
        >
          {{ p.name }}
        </p>

        <p class="text-sm text-gray-500 font-medium mt-1">
          Rp {{ p.price.toLocaleString() }} / {{ p.unit }}
        </p>

        <!-- Add indicator on hover -->
        <div
          class="absolute top-3 left-3 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200 shadow-md"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredProducts.length === 0"
      class="flex flex-col items-center justify-center py-12 text-center"
    >
      <div
        class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4"
      >
        <svg
          class="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <p class="text-gray-500 font-medium">Produk tidak ditemukan</p>
      <p class="text-gray-400 text-sm mt-1">Coba cari dengan kata kunci lain</p>
    </div>
  </div>
</template>
