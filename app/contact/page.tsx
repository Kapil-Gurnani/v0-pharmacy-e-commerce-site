"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="max-w-xl space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Contact us</h1>
        <p className="text-muted-foreground">Questions about a product or order? We’re here to help.</p>
      </header>

      {submitted ? (
        <p role="status" className="rounded-md bg-secondary p-4">
          Thanks for your message — we’ll get back to you soon.
        </p>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            setSubmitted(true)
          }}
        >
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="grid gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea id="message" name="message" rows={5} required />
          </div>
          <Button type="submit">Send message</Button>
        </form>
      )}
    </div>
  )
}
