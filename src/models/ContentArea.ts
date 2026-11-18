export type ContentAreaBranding = {
  logoUrl?: string
  secondaryLogoUrl?: string
  primaryColor?: string
  learningColor?: string
  trainingColor?: string
}

export type ContentAreaHint = {
  title?: string
  text: string
  url?: string
  urlLabel?: string
}

export type ContentAreaInfo = {
  branding?: ContentAreaBranding
  hint?: ContentAreaHint
}

type ContentArea = {
  id: number
  token: string
  name: string
  code: string
} & ContentAreaInfo

export type WithToken<Id> = {
  id: Id
  token?: string
}

export default ContentArea
