const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Введите email'
  if (!EMAIL_PATTERN.test(email.trim())) return 'Некорректный email'
}
