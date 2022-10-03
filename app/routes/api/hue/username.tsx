import type { ActionFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { hueClient } from '~/libs/ky'
import { getToken } from '~/utils/bearer'

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case 'POST': {
      const token = getToken(request.headers.get('Authorization') || '')

      if (!token) {
        return new Response(null, { status: 400 })
      }

      console.log('~ process.env.HUE_APP_NAME', process.env.HUE_APP_NAME)
      const data = await hueClient
        .post('route/api', {
          json: { devicetype: process.env.HUE_APP_NAME },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .json()

      return json(data)
    }
  }
}
