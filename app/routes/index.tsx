import type { ChangeEvent } from 'react'
import { styled } from '~/libs/stitches'
import { client } from '~/libs/ky'

import type { LoaderFunction } from '@remix-run/cloudflare'
import { userHueCode } from '~/cookies'
import { useLoaderData } from '@remix-run/react'
import type { HueTokenResponse } from '~/interfaces/hue'
import { useRefreshHueToken } from '~/hooks/hue'
import { useHueAccessToken, useHueRefreshToken } from '~/stores/hue'
import { useEffect, useState } from 'react'
import ky from 'ky-universal'

interface LoaderData {
  hueCode: string
  hueAccessToken: string
  hueRefreshToken: HueTokenResponse['refresh_token']
  hueAccessTokenExpiresIn: HueTokenResponse['expires_in']
  hueClientId: string
}

export const loader: LoaderFunction = async ({ request, context }) => {
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await userHueCode.parse(cookieHeader)) || {}

  let { hueCode, hueRefreshToken } = cookie

  let hueAccessToken = ''
  let hueAccessTokenExpiresIn = 0

  const isTokenInvalid = !cookie.hueRefreshToken

  if (hueCode && isTokenInvalid) {
    const auths = new URLSearchParams()

    auths.set('grant_type', 'authorization_code')
    auths.set('code', hueCode)
    auths.set('client_id', (HUE_CLIENT_ID as string) || '')
    auths.set('client_secret', (HUE_CLIENT_SECRET as string) || '')

    const res = await client.post('https://api.meethue.com/v2/oauth2/token', {
      body: auths,
    })
    const { refresh_token, access_token, expires_in } =
      await res.json<HueTokenResponse>()

    cookie.hueRefreshToken = refresh_token
    hueAccessToken = access_token
    hueRefreshToken = refresh_token
    hueAccessTokenExpiresIn = expires_in
  }

  const bodyObject: LoaderData = {
    hueCode,
    hueAccessToken,
    hueRefreshToken,
    hueAccessTokenExpiresIn,
    hueClientId: HUE_CLIENT_ID as string,
  }
  const body = JSON.stringify(bodyObject)

  return new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': await userHueCode.serialize(cookie),
    },
  })
}

export default function Index() {
  const { hueCode, hueRefreshToken, hueAccessToken, hueClientId } =
    useLoaderData<LoaderData>()
  const HUE_CLIENT_ID =
    typeof window !== 'undefined' ? window.ENV.HUE_CLIENT_ID : hueClientId

  const [refreshToken, setRefreshToken] = useHueRefreshToken()
  const [accessToken, setAccessToken] = useHueAccessToken()

  useEffect(() => {
    setRefreshToken(hueRefreshToken)
    setAccessToken(hueAccessToken)
  }, [hueAccessToken, hueRefreshToken, setAccessToken, setRefreshToken])

  useRefreshHueToken()

  const [hueConfig, setHueConfig] = useState<any>()
  const [hueUsername, setHueUsername] = useState<any>()
  const [hueDevices, setHueDevices] = useState<any[]>([])
  const [hueCurrentDevice, setHueCurrentDevice] = useState<string>('')

  let client = ky.create({
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'hue-application-key': hueUsername,
    },
  })

  // Bridge Button Config

  const handleHueConfig = async () => {
    setHueConfig(await client.put('/api/hue/config').json())
  }

  // Getting username

  const handleHueUsername = async () => {
    const data = await client.post('/api/hue/username').json<any>()

    const username = data[0].success.username
    console.log('~ username', username)
    setHueUsername(username)
  }

  // Retreiving devices

  const handleHueDevices = async () => {
    const res = await client.get('/api/hue/devices').json<any>()
    const devices = res.data.map((device: { services: any[] }) =>
      device.services.find((item: { rtype: string }) => item.rtype === 'light')
    )
    setHueDevices(devices)
  }

  const handleSelectDevice = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setHueCurrentDevice(value)
  }

  const handleClick = async (value: 'on' | 'off') => {
    const condition = value === 'on'

    await client.put(`/api/hue/lights/${hueCurrentDevice}`, {
      json: { on: { on: condition } },
    })
  }

  return (
    <>
      <a
        href={`https://api.meethue.com/v2/oauth2/authorize?client_id=${HUE_CLIENT_ID}&response_type=code&state=1234`}
      >
        Hue Login
      </a>
      <div>{hueCode}</div>
      <div>{refreshToken}</div>
      <div>{accessToken}</div>

      <button onClick={handleHueConfig}>Config Hue</button>
      <div>{JSON.stringify(hueConfig)}</div>

      <button onClick={handleHueUsername}>Get Username</button>
      <div>{hueUsername}</div>

      <button onClick={handleHueDevices}>Retrive Devices</button>

      <select onChange={handleSelectDevice}>
        {hueDevices.map(
          (device) =>
            device && (
              <option value={device.rid} key={device.rid}>
                {device.rid}
              </option>
            )
        )}
      </select>
      <div>{hueCurrentDevice}</div>
      <div>
        <button onClick={() => handleClick('on')}>On</button>
      </div>
      <div>
        <button onClick={() => handleClick('off')}>Off</button>
      </div>
    </>
  )
}
