import ky from 'ky-universal'

export const client = ky.create({ credentials: undefined })

export const hueClient = client.extend({ prefixUrl: 'https://api.meethue.com' })
