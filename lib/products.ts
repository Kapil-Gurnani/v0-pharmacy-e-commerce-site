export type Product = {
  id: string
  name: string
  slug: string
  price: number
  description: string
  category: "OTC" | "Vitamins" | "First Aid" | "Personal Care"
}

export const allProducts: Product[] = [
  {
    id: "OTC-001",
    name: "Pain Relief Tablets 200mg",
    slug: "pain-relief-tablets-200mg",
    price: 8.99,
    description: "Fast-acting non-drowsy pain relief suitable for adults and children over 12.",
    category: "OTC",
  },
  {
    id: "VTM-002",
    name: "Vitamin C 1000mg",
    slug: "vitamin-c-1000mg",
    price: 12.5,
    description: "High-potency vitamin C to support immune function and everyday wellness.",
    category: "Vitamins",
  },
  {
    id: "FAD-003",
    name: "Elastic Bandage Wrap",
    slug: "elastic-bandage-wrap",
    price: 5.5,
    description: "Breathable, reusable support bandage for sprains and strains.",
    category: "First Aid",
  },
  {
    id: "PRC-004",
    name: "Antibacterial Hand Gel 250ml",
    slug: "antibacterial-hand-gel-250ml",
    price: 6.75,
    description: "Quick-drying hand sanitizer with moisturizing ingredients.",
    category: "Personal Care",
  },
  {
    id: "OTC-005",
    name: "Allergy Relief 10mg",
    slug: "allergy-relief-10mg",
    price: 14.25,
    description: "Once-daily antihistamine for indoor and outdoor allergies.",
    category: "OTC",
  },
  {
    id: "VTM-006",
    name: "Daily Multivitamin",
    slug: "daily-multivitamin",
    price: 18.0,
    description: "Balanced vitamins and minerals to fill everyday nutritional gaps.",
    category: "Vitamins",
  },
]

export const topProducts = allProducts.slice(0, 3)

export function getProductBySlug(slug: string) {
  return allProducts.find((p) => p.slug === slug)
}
