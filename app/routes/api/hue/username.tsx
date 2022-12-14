import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { hueClient } from '~/libs/ky'
import { getToken } from '~/utils/bearer'

export const action: ActionFunction = async ({ request, context }) => {
  switch (request.method) {
    case 'POST': {
      const token = getToken(request.headers.get('Authorization') || '')

      if (!token) {
        return new Response(null, { status: 400 })
      }

      const data = await hueClient
        .post('route/api', {
          json: { devicetype: context.HUE_APP_NAME },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .json()

      return json(data)
    }
  }
}
