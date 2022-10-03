import { createCookie } from '@remix-run/node' // or cloudflare/deno

export const userHueCode = createCookie('user-hue-code', {
  maxAge: 604_800,
})
