import Link from "next/link"
import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PhoneSignupForm from "@/components/auth/phone-signup-form"

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense fallback={<div>Loading...</div>}>
            <PhoneSignupForm />
          </Suspense>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="text-primary underline" href="/login">
              Sign in
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
