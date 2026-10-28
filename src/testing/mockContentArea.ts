import ContentArea from '../models/ContentArea'

export const mockTelcArea = (): ContentArea => ({
  id: 1,
  token: 'telc_token',
  name: 'telc',
  code: 'TELC2026',
  logoUrl: 'https://lunes.example/logo.png',
  secondaryLogoUrl: 'https://lunes.example/secondary.png',
  primaryColor: '#a01915',
  learningColor: '#007dbe',
  trainingColor: '#027b91',
})
