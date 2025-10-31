import Sponsor from '../models/sponsor'
import { getFromEndpoint } from './axios'

const Endpoints = {
  sponsors: 'sponsors',
}

type SponsorResponse = {
  id: number
  name: string
  url: string
  logo: string | null
}

const transformSponsorResponse = ({ name, url, logo }: SponsorResponse): Sponsor => ({
  name,
  url: url || null,
  logo,
})

export const getSponsors = async (): Promise<Sponsor[]> => {
  const response = await getFromEndpoint<SponsorResponse[]>(Endpoints.sponsors)
  return response.map(transformSponsorResponse)
}
