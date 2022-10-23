// Guide: https://developers.meethue.com/develop/hue-api/remote-authentication-oauth

import ky from 'ky-universal'
import { useEffect, useState } from 'react'
import { useInterval } from 'react-use'
import type { HueTokenResponse } from '~/interfaces/hue'
import {
  useHueAccessToken,
  useHueRefreshToken,
  useIsHueTokenChanging,
} from '~/stores/hue'

interface ControllHueProps {
  accessToken: string
  refreshToken: HueTokenResponse['refresh_token']
}

export function useRefreshHueToken() {
  const [accessToken, setAccessToken] = useHueAccessToken()
  const [refreshToken, setRefreshToken] = useHueRefreshToken()
  const [isChanging, setChanging] = useIsHueTokenChanging()

  useEffect(() => {
    setChanging(true)
  }, [setChanging])

  useEffect(() => {
    if (isChanging && refreshToken) {
      setChanging(false)

      ky.post('/api/hue/token', {
        json: { refreshToken },
      })
        .json<HueTokenResponse>()
        .then(({ access_token, refresh_token }) => {
          setAccessToken(access_token)
          setRefreshToken(refresh_token)
        })
    }
  }, [isChanging, refreshToken, setAccessToken, setChanging, setRefreshToken])

  useInterval(() => {
    setChanging(true)
  }, (604799 - 60) * 1000)
  // }, 10000)

  return accessToken
}

export function useControllHue({
  refreshToken: hueRefreshToken,
  accessToken: hueAccessToken,
}: ControllHueProps) {
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
  const client = ky.create({
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'hue-application-key': hueUsername,
    },
    credentials: undefined,
  })

  // Bridge Button Config

  const getHueConfig = async () => {
    setHueConfig(await client.put('/api/hue/config').json())
    return hueConfig
  }

  // Getting username

  const getHueUsername = async () => {
    const data = await client.post('/api/hue/username').json<any>()

    const username = data[0].success.username
    setHueUsername(username)

    return hueUsername
  }

  // Retreiving devices

  const getHueDevices = async () => {
    const res = await client.get('/api/hue/devices').json<any>()
    const devices = res.data.map((device: { services: any[] }) =>
      device.services.find((item: { rtype: string }) => item.rtype === 'light')
    )
    setHueDevices(devices)

    return devices
  }

  const controllLamp = async (device: string, value: 'on' | 'off') => {
    const condition = value === 'on'

    await client.put(`/api/hue/lights/${device}`, {
      json: { on: { on: condition } },
    })
  }

  return {
    getHueConfig,
    getHueUsername,
    getHueDevices,
    controllLamp,
    hueUsername,
  }
}

export function useRefreshHueTokenInterval() {}
