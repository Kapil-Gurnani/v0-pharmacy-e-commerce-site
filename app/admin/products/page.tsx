"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

type Product = {
  id: string
  name: string
  slug: string
  price: number
  category: string
  image?: string
  description?: string
  inStock?: boolean
}

function loadAdminProducts(): Product[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem("adminProducts")
    return raw ? (JSON.parse(raw) as Product[]) : []
  } catch {
    return []
  }
}
function saveAdminProducts(arr: Product[]) {
  try {
    localStorage.setItem("adminProducts", JSON.stringify(arr))
  } catch {}
}
function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [imageDataUrl, setImageDataUrl] = useState<string>("")
  const [desc, setDesc] = useState("")

  const categories = ["Pain Relief", "Wellness", "Personal Care", "Prescription Medicines", "Supplements"]

  useEffect(() => {
    setItems(loadAdminProducts())
  }, [])

  function addProduct() {
    if (!name.trim() || !price.trim()) return
    const p: Product = {
      id: crypto.randomUUID(),
      name: name.trim(),
      slug: slugify(name),
      price: Number(price),
      category: category.trim() || "General",
      image: imageDataUrl || "/medicine-bottle.jpg", // use uploaded image if present
      description: desc.trim(),
      inStock: true,
    }
    const next = [...items, p]
    setItems(next)
    saveAdminProducts(next)
    setName("")
    setPrice("")
    setCategory("")
    setImageDataUrl("")
    setDesc("")
  }

  function removeProduct(id: string) {
    const next = items.filter((p) => p.id !== id)
    setItems(next)
    saveAdminProducts(next)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            placeholder="Price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <select
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  setImageDataUrl(String(reader.result || ""))
                }
                reader.readAsDataURL(file)
              }}
              className="block w-full text-sm file:mr-3 file:rounded-md file:border file:bg-muted file:px-3 file:py-1.5 file:text-sm"
            />
            {imageDataUrl && (
              <img
                src={imageDataUrl || "/placeholder.svg"}
                alt="Uploaded preview"
                className="h-20 w-20 rounded-md object-cover"
              />
            )}
          </div>
          <Textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <div className="flex justify-end">
            <Button onClick={addProduct}>Add</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Note: These products are stored in your browser only (demo). We can wire this to a real database later.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-md border p-3">
              <img
                src={p.image || "/placeholder.svg?height=80&width=80&query=medicine%20bottle"}
                alt={p.name}
                className="h-16 w-16 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="truncate font-medium">{p.name}</div>
                  <Badge className="shrink-0">{"$" + p.price.toFixed(2)}</Badge>
                </div>
                <div className="truncate text-sm text-muted-foreground">{p.category}</div>
              </div>
              <Button variant="destructive" size="sm" onClick={() => removeProduct(p.id)}>
                Delete
              </Button>
            </div>
          ))}
          {items.length === 0 && <div className="text-sm text-muted-foreground">No admin products yet.</div>}
        </CardContent>
      </Card>
    </div>
  )
}
