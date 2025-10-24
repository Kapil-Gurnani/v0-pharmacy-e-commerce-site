import Link from "next/link"
import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PhoneLoginForm from "@/components/auth/phone-login-form"

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense fallback={<div>Loading...</div>}>
            <PhoneLoginForm />
          </Suspense>
          <p className="text-sm text-muted-foreground">
            New here?{" "}
            <Link className="text-primary underline" href="/signup">
              Create an account
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
