import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { getCssText } from '~/libs/stitches'
import { RecoilRoot } from 'recoil'

import normalize from 'modern-normalize/modern-normalize.css'

declare global {
  interface Window {
    ENV: any
  }
}

export async function loader() {
  return json({
    ENV: {
      HUE_CLIENT_ID: process.env.HUE_CLIENT_ID,
    },
  })
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
})

export function links() {
  return [{ rel: 'stylesheet', href: normalize }]
}

export default function App() {
  const data = useLoaderData()

  return (
    <html lang="ko">
      <head>
        <Meta />
        <Links />
        <style
          id="stitches"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
      </head>
      <body>
        <RecoilRoot>
          <Outlet />
          <ScrollRestoration />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
            }}
          />
          <Scripts />
          <LiveReload />
        </RecoilRoot>
      </body>
    </html>
  )
}
