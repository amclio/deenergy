import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { hueClient } from '~/libs/ky'
import { getToken } from '~/utils/bearer'

export const action: ActionFunction = async ({ request, params }) => {
  switch (request.method) {
    case 'PUT': {
      const token = getToken(request.headers.get('Authorization') || '')
      const username = request.headers.get('hue-application-key') || ''

      const dto = await request.json()

      if (!username) {
        return new Response(null, { status: 400 })
      }

      const data = await hueClient
        .put(`route/clip/v2/resource/light/${params.id}`, {
          json: dto,
          headers: {
            Authorization: `Bearer ${token}`,
            'hue-application-key': username,
          },
        })
        .json()

      return json(data)
    }
  }
}
