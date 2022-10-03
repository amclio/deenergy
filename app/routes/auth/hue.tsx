import type { LoaderFunction } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
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
