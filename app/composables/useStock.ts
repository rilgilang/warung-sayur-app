// Stock management composable
// In production, replace with actual API calls

interface StockItem {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
  price: number;
}

// Demo stock data per branch
const stockData = ref<Record<number, StockItem[]>>({
  1: [
    { id: 1, name: "Bayam", category: "sayur", stock: 50, unit: "ikat", minStock: 20, price: 5000 },
    { id: 2, name: "Kangkung", category: "sayur", stock: 45, unit: "ikat", minStock: 20, price: 4000 },
    { id: 3, name: "Sawi Hijau", category: "sayur", stock: 30, unit: "ikat", minStock: 15, price: 6000 },
    { id: 4, name: "Wortel", category: "sayur", stock: 25, unit: "kg", minStock: 10, price: 8000 },
    { id: 5, name: "Tomat", category: "sayur", stock: 20, unit: "kg", minStock: 10, price: 7000 },
    { id: 6, name: "Terong", category: "sayur", stock: 18, unit: "kg", minStock: 10, price: 6000 },
    { id: 7, name: "Timun", category: "sayur", stock: 35, unit: "kg", minStock: 15, price: 5000 },
    { id: 8, name: "Cabai Merah", category: "bumbu", stock: 12, unit: "kg", minStock: 5, price: 15000 },
    { id: 9, name: "Cabai Rawit", category: "bumbu", stock: 8, unit: "kg", minStock: 5, price: 18000 },
    { id: 10, name: "Bawang Merah", category: "bumbu", stock: 15, unit: "kg", minStock: 8, price: 12000 },
    { id: 11, name: "Bawang Putih", category: "bumbu", stock: 20, unit: "kg", minStock: 10, price: 10000 },
    { id: 12, name: "Jahe", category: "bumbu", stock: 10, unit: "kg", minStock: 5, price: 9000 },
  ],
  2: [
    { id: 1, name: "Bayam", category: "sayur", stock: 40, unit: "ikat", minStock: 20, price: 5000 },
    { id: 2, name: "Kangkung", category: "sayur", stock: 35, unit: "ikat", minStock: 20, price: 4000 },
    { id: 3, name: "Sawi Hijau", category: "sayur", stock: 25, unit: "ikat", minStock: 15, price: 6000 },
    { id: 4, name: "Wortel", category: "sayur", stock: 30, unit: "kg", minStock: 10, price: 8000 },
    { id: 5, name: "Tomat", category: "sayur", stock: 22, unit: "kg", minStock: 10, price: 7000 },
    { id: 8, name: "Cabai Merah", category: "bumbu", stock: 6, unit: "kg", minStock: 5, price: 15000 },
    { id: 9, name: "Cabai Rawit", category: "bumbu", stock: 4, unit: "kg", minStock: 5, price: 18000 },
    { id: 10, name: "Bawang Merah", category: "bumbu", stock: 12, unit: "kg", minStock: 8, price: 12000 },
  ],
  3: [
    { id: 1, name: "Bayam", category: "sayur", stock: 30, unit: "ikat", minStock: 20, price: 5000 },
    { id: 2, name: "Kangkung", category: "sayur", stock: 25, unit: "ikat", minStock: 20, price: 4000 },
    { id: 4, name: "Wortel", category: "sayur", stock: 20, unit: "kg", minStock: 10, price: 8000 },
    { id: 8, name: "Cabai Merah", category: "bumbu", stock: 3, unit: "kg", minStock: 5, price: 15000 },
  ],
  4: [
    { id: 1, name: "Bayam", category: "sayur", stock: 45, unit: "ikat", minStock: 20, price: 5000 },
    { id: 2, name: "Kangkung", category: "sayur", stock: 40, unit: "ikat", minStock: 20, price: 4000 },
    { id: 3, name: "Sawi Hijau", category: "sayur", stock: 35, unit: "ikat", minStock: 15, price: 6000 },
    { id: 5, name: "Tomat", category: "sayur", stock: 28, unit: "kg", minStock: 10, price: 7000 },
    { id: 8, name: "Cabai Merah", category: "bumbu", stock: 10, unit: "kg", minStock: 5, price: 15000 },
    { id: 10, name: "Bawang Merah", category: "bumbu", stock: 18, unit: "kg", minStock: 8, price: 12000 },
  ],
});

export function useStock() {
  const getStock = (branchId: number) => {
    return stockData.value[branchId] || [];
  };

  const setStock = (branchId: number, stock: StockItem[]) => {
    stockData.value[branchId] = stock;
  };

  const updateStock = (branchId: number, itemId: number, updatedItem: Partial<StockItem>) => {
    const branchStock = stockData.value[branchId];
    if (branchStock) {
      const item = branchStock.find(i => i.id === itemId);
      if (item) {
        Object.assign(item, updatedItem);
      }
    }
  };

  const addStock = (branchId: number, item: StockItem) => {
    if (!stockData.value[branchId]) {
      stockData.value[branchId] = [];
    }
    stockData.value[branchId].push(item);
  };

  const removeStock = (branchId: number, itemId: number) => {
    const branchStock = stockData.value[branchId];
    if (branchStock) {
      const index = branchStock.findIndex(i => i.id === itemId);
      if (index !== -1) {
        branchStock.splice(index, 1);
      }
    }
  };

  const deductStock = (branchId: number, cartItems: any[]) => {
    const branchStock = stockData.value[branchId];
    if (!branchStock) return { success: false, message: "Branch stock not found" };

    // Check stock availability first
    for (const item of cartItems) {
      const stockItem = branchStock.find(i => i.id === item.id);
      if (!stockItem) {
        return { success: false, message: `${item.name} tidak ditemukan dalam stok` };
      }

      // For weighted items, convert to kg
      let qtyNeeded = item.qty;
      if (item.weight) {
        // Weight is in grams, convert to kg for stock deduction
        qtyNeeded = item.weight / 1000;
      }

      if (stockItem.stock < qtyNeeded) {
        return {
          success: false,
          message: `Stok ${item.name} tidak mencukupi (tersedia: ${stockItem.stock} ${stockItem.unit})`
        };
      }
    }

    // Deduct stock
    for (const item of cartItems) {
      const stockItem = branchStock.find(i => i.id === item.id);
      if (stockItem) {
        let qtyNeeded = item.qty;
        if (item.weight) {
          qtyNeeded = item.weight / 1000;
        }
        stockItem.stock -= qtyNeeded;
      }
    }

    return { success: true, message: "Stok berhasil dikurangi" };
  };

  const getLowStockItems = (branchId: number) => {
    const branchStock = stockData.value[branchId] || [];
    return branchStock.filter(item => item.stock <= item.minStock);
  };

  return {
    getStock,
    setStock,
    updateStock,
    addStock,
    removeStock,
    deductStock,
    getLowStockItems,
  };
}
