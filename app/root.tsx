import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { RecoilRoot } from 'recoil'

import normalize from 'modern-normalize/modern-normalize.css'
import { useLayoutEffect } from 'react'
import { getCssText } from './libs/stitches'
import { useSsrComplectedState } from './stores/prevent-ssr'

declare global {
  interface Window {
    ENV: any
  }
}

export const loader: LoaderFunction = ({ context }) => {
  return json({
    ENV: {
      HUE_CLIENT_ID: context.HUE_CLIENT_ID,
    },
  })
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'De에너지',
  viewport: 'width=device-width,initial-scale=1',
})

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: normalize },
    {
      rel: 'preload',
      href: `/assets/fonts/suit/SUIT-Regular.woff2`,
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      href: `/assets/fonts/suit/SUIT-Medium.woff2`,
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      href: `/assets/fonts/suit/SUIT-SemiBold.woff2`,
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
    {
      rel: 'preload',
      href: `/assets/fonts/suit/SUIT-Bold.woff2`,
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    },
  ]
}

function PreventSsr() {
  // Ref: https://stackoverflow.com/questions/68110629/nextjs-react-recoil-persist-values-in-local-storage-initial-page-load-in-wrong/70459889#70459889
  const setSsrCompleted = useSsrComplectedState()
  useLayoutEffect(setSsrCompleted, [setSsrCompleted])

  return null
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
          <PreventSsr />
        </RecoilRoot>
      </body>
    </html>
  )
}
