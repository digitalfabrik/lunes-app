import ContentArea from '../models/ContentArea'

export const mockTelcArea = (): ContentArea => ({
  id: 1,
  token: 'telc_token',
  name: 'telc',
  code: 'TELC2026',
  branding: {
    logoUrl: 'https://lunes.example/logo.png',
    secondaryLogoUrl: 'https://lunes.example/secondary.png',
    primaryColor: '#a01915',
    learningColor: '#007dbe',
    trainingColor: '#027b91',
  },
})

export const mockLightTelcArea = (): ContentArea => ({
  ...mockTelcArea(),
  branding: { primaryColor: '#ffff00', learningColor: '#f0f0f0', trainingColor: '#cccccc' },
})
