// Guide: https://developers.meethue.com/develop/hue-api/remote-authentication-oauth

import { useInterval } from 'react-use'
import { useEffect } from 'react'
import ky from 'ky'
import {
  useHueAccessToken,
  useHueRefreshToken,
  useIsHueTokenChanging,
} from '~/stores/hue'
import type { HueTokenResponse } from '~/interfaces/hue'

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

export function useRefreshHueTokenInterval() {}
