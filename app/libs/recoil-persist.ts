// Ref: https://stackoverflow.com/questions/68110629/nextjs-react-recoil-persist-values-in-local-storage-initial-page-load-in-wrong/70459889#70459889
import type { AtomEffect } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import { ssrCompletedState } from '~/stores/prevent-ssr'

const { persistAtom } = recoilPersist()

export const persistAtomEffect = <T>(param: Parameters<AtomEffect<T>>[0]) => {
  param.getPromise(ssrCompletedState).then(() => persistAtom(param))
}
