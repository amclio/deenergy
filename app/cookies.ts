import { createCookie } from '@remix-run/cloudflare' // or cloudflare/deno

export const userHueCode = createCookie('user-hue-code', {
  maxAge: 604_800,
})
