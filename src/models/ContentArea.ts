type ContentArea = {
  token: string
  name: string
  shortName: string
}

export type WithToken<Id> = {
  id: Id
  token?: string
}

export default ContentArea
