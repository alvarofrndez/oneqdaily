export const passwordRules = {
  minLength: (password: string) => password.length >= 8,
  lowercase: (password: string) => /[a-z]/.test(password),
  uppercase: (password: string) => /[A-Z]/.test(password),
  number: (password: string) => /\d/.test(password),
  symbol: (password: string) =>
    /[!@#$%^&*()_+\-=[\]{};':"\\|<>?,./`~]/.test(password),
};