type ContentArea = {
  id: number
  token: string
  name: string
  code: string
  primaryColor?: string
}

export type WithToken<Id> = {
  id: Id
  token?: string
}

export default ContentArea
