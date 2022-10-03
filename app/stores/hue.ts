import { atom, useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'

export const hueAccessToken = atom<string | null>({
  key: 'hueAccessToken',
  default: null,
})

export function useHueAccessToken() {
  return useRecoilState(hueAccessToken)
}

export function useSetHueAccessToken() {
  return useSetRecoilState(hueAccessToken)
}

export function useHueAccessTokenValue() {
  return useRecoilValue(hueAccessToken)
}

export const hueRefreshToken = atom<string | null>({
  key: 'hueRefreshToken',
  default: null,
})

export function useHueRefreshToken() {
  return useRecoilState(hueRefreshToken)
}

export function useSetHueRefreshToken() {
  return useSetRecoilState(hueRefreshToken)
}

export function useHueRefreshTokenValue() {
  return useRecoilValue(hueRefreshToken)
}

export const isHueTokenChanging = atom<boolean>({
  key: 'isHueTokenChanging',
  default: false,
})

export function useIsHueTokenChanging() {
  return useRecoilState(isHueTokenChanging)
}

export function useSetIsHueTokenChanging() {
  return useSetRecoilState(isHueTokenChanging)
}

export function useIsHueTokenChangingValue() {
  return useRecoilValue(isHueTokenChanging)
}

// export const hueUsername = selector({
//   key: 'filteredTodoListState',
//   get: async ({ get }) => {
//     const accessToken = get(hueAccessToken)

//     if (accessToken) {
//       ky.post('https://api.meethue.com/route/api', {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }).json()
//     }

//   },
// })

// export const hueToken = selector({})
