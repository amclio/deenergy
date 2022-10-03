import type { Options } from 'ky'
import ky from 'ky'
import { fetch } from '@remix-run/node'

export const client = ky.create({ fetch: fetch as Options['fetch'] })

export const hueClient = client.extend({ prefixUrl: 'https://api.meethue.com' })
