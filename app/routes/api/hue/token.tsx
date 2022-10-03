import type { ActionFunction } from '@remix-run/node'
import { userHueCode } from '~/cookies'
import { getRefreshHueAccessTokenFromHueApi } from '~/utils/hue'

interface PostBody {
  refreshToken: string
}

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case 'POST': {
      const cookieHeader = request.headers.get('Cookie')
      const cookie = (await userHueCode.parse(cookieHeader)) || {}

      const { refreshToken } = (await request.json()) as PostBody
      const auths = await getRefreshHueAccessTokenFromHueApi({
        refreshToken,
        clientId: process.env.HUE_CLIENT_ID || '',
        clientSecret: process.env.HUE_CLIENT_SECRET || '',
      })

      const body = JSON.stringify(auths)

      cookie.hueRefreshToken = auths.refresh_token

      return new Response(body, {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': await userHueCode.serialize(cookie),
        },
      })
    }
  }
}
