"use client"

import { type ReactNode, useMemo } from "react"
import { useAuth } from "@/components/auth/auth-context"
import { isAdmin } from "@/lib/admin"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminGate({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const allowed = useMemo(() => isAdmin(user), [user])

  if (!allowed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Access Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">You must be logged in as an admin to view this page.</p>
          <div className="flex items-center gap-3">
            <Link href="/login" className="underline">
              Sign in
            </Link>
            <Link href="/" className="underline">
              Go to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}
