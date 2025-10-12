import type { Order } from "./analytics"

// Pharmacy-themed sample orders spanning recent days, with categories
export const demoOrders: Order[] = [
  {
    id: "D-1001",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Delivered",
    total: 1249.5,
    items: [
      { id: "p-ibuprofen", name: "Ibuprofen 200mg", price: 149.5, qty: 2, category: "Pain Relief" },
      { id: "p-vitc", name: "Vitamin C 500mg", price: 250, qty: 1, category: "Vitamins" },
      { id: "p-sanitizer", name: "Hand Sanitizer 250ml", price: 150, qty: 3, category: "Personal Care" },
    ],
  },
  {
    id: "D-1002",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Shipped",
    total: 2199,
    items: [
      { id: "p-paracetamol", name: "Paracetamol 500mg", price: 99, qty: 5, category: "Pain Relief" },
      { id: "p-multivit", name: "Multivitamin", price: 599, qty: 2, category: "Vitamins" },
      { id: "p-mask", name: "N95 Mask", price: 199, qty: 3, category: "Personal Care" },
    ],
  },
  {
    id: "D-1003",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Processing",
    total: 899,
    items: [
      { id: "p-antacid", name: "Antacid Syrup", price: 199, qty: 2, category: "Digestive Health" },
      { id: "p-oral", name: "Oral Rehydration Salts", price: 99, qty: 3, category: "Digestive Health" },
      { id: "p-baby", name: "Baby Lotion 200ml", price: 199, qty: 1, category: "Infant Care" },
    ],
  },
  {
    id: "D-1004",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Delivered",
    total: 1799,
    items: [
      { id: "p-therm", name: "Digital Thermometer", price: 499, qty: 1, category: "Devices" },
      { id: "p-omega3", name: "Omega-3 Capsules", price: 650, qty: 2, category: "Vitamins" },
    ],
  },
  {
    id: "D-1005",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Placed",
    total: 1299,
    items: [{ id: "p-bp", name: "BP Monitor Cuff", price: 1299, qty: 1, category: "Devices" }],
  },
]
