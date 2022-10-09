import { atom, atomFamily } from 'recoil'
import { persistAtomEffect } from '~/libs/recoil-persist'

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

export const usageStatState = atom<number>({
  key: 'usageStatState',
  default: 0,
})
