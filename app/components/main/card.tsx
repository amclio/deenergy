import type { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLButtonElement> {
  name: string
  spending: number
  isActive?: boolean
  imageSrc: string
  imageAlt?: string
}

export function Card({
  name,
  spending,
  isActive = false,
  imageSrc,
  imageAlt,
  ...props
}: CardProps) {
  const status = isActive ? 'card active' : 'card'

  return (
    <button className={status} {...props}>
      <div>
        <div className="name">{name}</div>
        <div className="status">{isActive ? '켜짐' : '꺼짐'}</div>
        <div className="icon">
          <img src={imageSrc} alt={imageAlt || name} />
        </div>
      </div>
      <div>
        <div className="spending">
          <span className="number">{spending}</span>
          <span className="wh">W</span>
        </div>
      </div>
    </button>
  )
}
