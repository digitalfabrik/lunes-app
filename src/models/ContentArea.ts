export type ContentAreaBranding = {
  logoUrl?: string
  secondaryLogoUrl?: string
  primaryColor?: string
  learningColor?: string
  trainingColor?: string
}

type ContentArea = {
  id: number
  token: string
  name: string
  code: string
  branding?: ContentAreaBranding
}

export type WithToken<Id> = {
  id: Id
  token?: string
}

export default ContentArea
