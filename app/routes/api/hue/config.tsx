import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { hueClient } from '~/libs/ky'
import { getToken } from '~/utils/bearer'

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case 'PUT': {
      const token = getToken(request.headers.get('Authorization') || '')

      if (!token) {
        return new Response(null, { status: 400 })
      }

      const data = await hueClient
        .put('route/api/0/config', {
          json: { linkbutton: true },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .json()

      return json(data)
    }
  }
}
