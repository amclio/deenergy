// Guide: https://developers.meethue.com/develop/hue-api/remote-authentication-oauth

import { client as plainClient } from '~/libs/ky'

import type { HueTokenResponse } from '~/interfaces/hue'

const client = plainClient.extend({ prefixUrl: 'https://api.meethue.com' })

export async function getRefreshHueAccessTokenFromHueApi({
  refreshToken,
  clientId,
  clientSecret,
}: {
  refreshToken: string
  clientId: string
  clientSecret: string
}) {
  const body = new URLSearchParams()

  body.set('grant_type', 'refresh_token')
  body.set('refresh_token', refreshToken)
  body.set('client_id', clientId)
  body.set('client_secret', clientSecret)

  return await client.post('v2/oauth2/token', { body }).json<HueTokenResponse>()
}
