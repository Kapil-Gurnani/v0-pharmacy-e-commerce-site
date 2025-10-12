export const ADMIN_PHONES = new Set<string>([
  // Add your admin phone numbers here in E.164 or your chosen format
  "+15551234567",
  "9999999999",
])

export type AdminUser = { phone: string; name?: string }

export function isAdmin(user: { phone?: string | null } | null | undefined) {
  if (!user?.phone) return false
  return ADMIN_PHONES.has(user.phone)
}
