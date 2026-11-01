const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const MIN_PASSWORD_LENGTH = 8

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Введите email'
  if (!EMAIL_PATTERN.test(email.trim())) return 'Некорректный email'
}

type PasswordPairMessages = {
  emptyPassword: string
  emptyRepeat: string
}

// Новый пароль и его повтор
export function validatePasswordPair(password: string, repeat: string, messages: PasswordPairMessages) {
  const errors: { password?: string; passwordRepeat?: string } = {}

  if (!password) errors.password = messages.emptyPassword
  else if (password.length < MIN_PASSWORD_LENGTH) errors.password = `Минимум ${MIN_PASSWORD_LENGTH} символов`

  if (!repeat) errors.passwordRepeat = messages.emptyRepeat
  else if (repeat !== password) errors.passwordRepeat = 'Пароли не совпадают'

  return errors
}
