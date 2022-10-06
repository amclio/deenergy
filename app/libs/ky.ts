import ky from 'ky-universal'
import {} from '@remix-run/cloudflare'

export const client = ky.create({ fetch })
// export const client = ky.create({})

export const hueClient = client.extend({ prefixUrl: 'https://api.meethue.com' })
