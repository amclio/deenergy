import { styled } from '~/libs/stitches'

export const Button = styled('button', {
  border: 'none',
  padding: '0.6em 1.2em',
  borderRadius: '8px',
  fontWeight: '600',

  variants: {
    color: {
      green: {
        color: '#18794e',
        backgroundColor: '#ddf3e4',

        '&:hover': {
          backgroundColor: '#ccebd7',
        },
        '&:active': {
          backgroundColor: '#b4dfc4',
        },
      },
      red: {
        color: '#cd2b31',
        backgroundColor: '#ffe5e5',

        '&:hover': {
          backgroundColor: '#fdd8d8',
        },
        '&:active': {
          backgroundColor: '#f9c6c6',
        },
      },
    },
  },
  defaultVariants: {
    color: 'green',
  },
})
