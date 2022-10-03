import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { userHueCode } from '~/cookies'

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  return redirect('/', {
    headers: {
      'Set-Cookie': await userHueCode.serialize({ hueCode: code }),
    },
  })
}
