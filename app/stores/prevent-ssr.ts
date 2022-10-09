// Ref: https://stackoverflow.com/questions/68110629/nextjs-react-recoil-persist-values-in-local-storage-initial-page-load-in-wrong/70459889#70459889
import { atom, useSetRecoilState } from 'recoil'

export const ssrCompletedState = atom({
  key: 'SsrCompleted',
  default: false,
})

export const useSsrComplectedState = () => {
  const setSsrCompleted = useSetRecoilState(ssrCompletedState)
  return () => setSsrCompleted(true)
}
