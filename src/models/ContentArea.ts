export type ContentAreaBranding = {
  logoUrl?: string
  secondaryLogoUrl?: string
  primaryColor?: string
  learningColor?: string
  trainingColor?: string
}

type ContentArea = ContentAreaBranding & {
  id: number
  token: string
  name: string
  code: string
}

export type WithToken<Id> = {
  id: Id
  token?: string
}

export default ContentArea
