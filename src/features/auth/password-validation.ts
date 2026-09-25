export const PASSWORD_MIN_LENGTH = 8

export type PasswordValidationError =
  | 'passwordTooShort'
  | 'passwordMissingLowercase'
  | 'passwordMissingUppercase'
  | 'passwordMissingNumber'
  | 'passwordMissingSymbol'
  | 'passwordsDoNotMatch'

export function validatePassword(
  password: unknown,
  confirmPassword?: unknown
): PasswordValidationError | null {
  if (typeof password !== 'string' || !password) {
    return 'passwordTooShort'
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return 'passwordTooShort'
  }

  if (!/[a-z]/.test(password)) {
    return 'passwordMissingLowercase'
  }

  if (!/[A-Z]/.test(password)) {
    return 'passwordMissingUppercase'
  }

  if (!/\d/.test(password)) {
    return 'passwordMissingNumber'
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|<>?,./`~]/.test(password)) {
    return 'passwordMissingSymbol'
  }

  // Solo validamos confirmación si se pasa el parámetro
  if (confirmPassword !== undefined) {
    if (typeof confirmPassword !== 'string' || password !== confirmPassword) {
      return 'passwordsDoNotMatch'
    }
  }

  return null
}