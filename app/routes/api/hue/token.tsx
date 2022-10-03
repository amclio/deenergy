import type { ActionFunction } from '@remix-run/cloudflare'
import { userHueCode } from '~/cookies'
import { getRefreshHueAccessTokenFromHueApi } from '~/utils/hue'

interface PostBody {
  refreshToken: string
}

export const action: ActionFunction = async ({ request, context }) => {
  switch (request.method) {
    case 'POST': {
      const cookieHeader = request.headers.get('Cookie')
      const cookie = (await userHueCode.parse(cookieHeader)) || {}

      const { refreshToken } = (await request.json()) as PostBody
      const auths = await getRefreshHueAccessTokenFromHueApi({
        refreshToken,
        clientId: (HUE_CLIENT_ID as string) || '',
        clientSecret: (HUE_CLIENT_SECRET as string) || '',
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
