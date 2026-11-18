import ContentArea from '../models/ContentArea'

export const mockTelcArea = (): ContentArea => ({
  id: 1,
  token: 'telc_token',
  name: 'telc',
  code: 'TELC2026',
  branding: {
    logoUrl: 'https://lunes.example/logo.png',
    secondaryLogoUrl: 'https://lunes.example/secondary.svg',
    primaryColor: '#a01915',
    learningColor: '#007dbe',
    trainingColor: '#027b91',
  },
  hint: {
    title: 'Passend zu Fach.Sprache von telc',
    text: 'Der Fachwortschatz in diesem Bereich passt genau zur telc Lehrwerksreihe Fach.Sprache für Ihren Beruf.',
    url: 'https://www.telc.net/deutsch-fuer-fachkraefte/',
    urlLabel: 'Mehr über unsere Angebote für Fachkräfte',
  },
})

export const mockLightTelcArea = (): ContentArea => ({
  ...mockTelcArea(),
  branding: { primaryColor: '#ffff00', learningColor: '#f0f0f0', trainingColor: '#cccccc' },
})
