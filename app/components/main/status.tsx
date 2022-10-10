import type { HTMLAttributes } from 'react'
import { styled } from '~/libs/stitches'

interface LabelProps extends HTMLAttributes<HTMLDivElement> {
  state?: 'good' | 'warning' | 'danger'
}

const LabelContainer = styled('div', {
  padding: '6px 12px',
  borderRadius: '8px',
  display: 'inline',
  fontSize: '0.8rem',
  fontWeight: 600,

  variants: {
    state: {
      good: {
        color: '#3b5bdb',
        backgroundColor: '#dbe4ff',
      },
      warning: {
        color: '#f08c00',
        backgroundColor: '#fff3bf',
      },
      danger: {
        color: '#e03131',
        backgroundColor: '#ffe3e3',
      },
    },
  },
  defaultVariants: {
    state: 'good',
  },
})

export function StatusLabel({ state, className, ...props }: LabelProps) {
  return (
    <LabelContainer state={state} {...props}>
      에너지 절약 상태 — {state === 'good' && '좋음'}
      {state === 'warning' && '경고'}
      {state === 'danger' && '위험'}
    </LabelContainer>
  )
}
