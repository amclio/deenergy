import type { Options } from 'ky-universal'
import ky from 'ky-universal'
// import { fetch } from '@remix-run/cloudflare'

export const client = ky.create({ credentials: undefined })

export const hueClient = client.extend({ prefixUrl: 'https://api.meethue.com' })
