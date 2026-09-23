type ContentArea = {
  id: number
  token: string
  name: string
}

export type WithToken<Id> = {
  id: Id
  token?: string
}

export default ContentArea
