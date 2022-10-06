import type { LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { hueClient } from '~/libs/ky'
import { getToken } from '~/utils/bearer'

export const loader: LoaderFunction = async ({ request }) => {
  const token = getToken(request.headers.get('Authorization') || '')
  const username = request.headers.get('hue-application-key') || ''

  if (!token || !username) {
    return new Response(null, { status: 400 })
  }

  const data = await hueClient
    .get('route/clip/v2/resource/device', {
      headers: {
        Authorization: `Bearer ${token}`,
        'hue-application-key': username,
      },
    })
    .json()
  return json(data)
}
