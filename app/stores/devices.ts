import { atom, atomFamily, selector } from 'recoil'
import { persistAtomEffect } from '~/libs/recoil-persist'
import { ssrCompletedState } from './prevent-ssr'

export interface DeviceState {
  status: boolean | null
  spending: number | null
}

export const devicesStateFamily = atomFamily<DeviceState, number>({
  key: 'devicesState',
  default: { status: null, spending: null },
  effects_UNSTABLE: [persistAtomEffect],
})

export const entireUsageState = atom<number>({
  key: 'entireUsageState',
  default: 0,
})

export const accumulatedSpendingState = atom<{
  spending: number
  preserved: number
}>({
  key: 'accumulatedSpendingState',
  default: { spending: 0, preserved: 0 },
  effects_UNSTABLE: [persistAtomEffect],
})

function calcEnergy(energy: number) {
  const perSecond = energy / 60 / 60 // wh
  const isLow = perSecond < 1000

  const text = isLow
    ? Math.round(perSecond * 100) / 100
    : Math.round((perSecond / 1000) * 100) / 100
  const unit = isLow ? 'Wh' : 'kWh'

  return { text, unit, message: '' }
}

export const spendingTextsState = selector({
  key: 'spendingTextsState',
  get: ({ get }) => {
    const { spending, preserved } = get(accumulatedSpendingState)
    const isSsrComplete = get(ssrCompletedState)

    if (!isSsrComplete) {
      const loadingMessage = { text: 0, unit: '', message: '불러오는 중...' }
      return {
        spending: loadingMessage,
        preserved: loadingMessage,
      }
    }

    return {
      spending: calcEnergy(spending),
      preserved: calcEnergy(preserved),
    }
  },
})
