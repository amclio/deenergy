import Chart from 'chart.js/auto'
import { useEffect, useRef, useState } from 'react'

import styles from '~/styles/processed/main.css'

import type { CardProps } from '~/components/main/card'
import { Card as CardContainer } from '~/components/main/card'
import { devicesStateFamily, entireUsageState } from '~/stores/devices'
import { useRecoilState } from 'recoil'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

function Graph() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref.current) {
      var L1x = ['7월', '8월', '9월', '10월', '11월', '12월']
      var L1y = [250, 280, 200, 180, 150, 300]
      var L2y = [789, 987, 876, 765, 654, 543]

      new Chart(ref.current, {
        // type: 'line',
        type: 'bar',
        data: {
          labels: L1x, //x축
          datasets: [
            {
              label: '2021년', //그래프 이름
              backgroundColor: '#ff6b6b', //그래프 배경색
              data: L1y, //y축
            },
            {
              label: '2022년',
              data: L2y,
              backgroundColor: '#5c7cfa',
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              grid: {
                display: false,
              },
            },
          },
        },
      })
    }
  }, [])

  if (typeof window === 'undefined') return null

  return <canvas id="LineG" ref={ref} style={{ width: '100%' }}></canvas>
}

const Devices: {
  id: number
  name: string
  spending: number
  imageSrc: string
}[] = [
  {
    id: 0,
    name: '전구',
    spending: 150,
    imageSrc: './assets/images/lamp.png',
  },
  {
    id: 1,
    name: 'TV',
    spending: 300,
    imageSrc: './assets/images/tv.png',
  },
  {
    id: 2,
    name: '에어컨',
    spending: 1500,
    imageSrc: './assets/images/air-conditioner.png',
  },
  {
    id: 3,
    name: '선풍기',
    spending: 50,
    imageSrc: './assets/images/fan.png',
  },
  {
    id: 4,
    name: '충전기',
    spending: 15,
    imageSrc: './assets/images/charger.png',
  },
]

function Card({ cardId, ...props }: { cardId: number } & CardProps) {
  const [cardState, setCardState] = useRecoilState(devicesStateFamily(cardId))

  const [entireUsage, setEntireUsage] = useRecoilState(entireUsageState)
  const [isLoaded, setLoaded] = useState(false)
  console.log('~ entireUsage', entireUsage)

  const handleClick = () => {
    setEntireUsage((curr) =>
      !cardState.status ? curr + props.spending : curr - props.spending
    )
    setCardState((state) => ({ ...state, status: !state.status }))
  }

  useEffect(() => {
    setCardState((status) => ({ ...status, spending: props.spending }))
  }, [props.spending, setCardState])

  useEffect(() => {
    if (props.spending && cardState.status !== null && !isLoaded) {
      setEntireUsage((curr) =>
        cardState.status ? curr + props.spending : curr
      )
      setLoaded(true)
    }
  }, [cardState.status, isLoaded, props.spending, setEntireUsage])

  return (
    <CardContainer
      isActive={cardState.status || false}
      onClick={handleClick}
      {...props}
    />
  )
}

export default function Index() {
  return (
    <>
      <header>
        <div className="backdrop">
          <div className="container">
            <div className="title">De에너지</div>
            <div className="sub">by CTQ from Seil</div>
          </div>
        </div>
      </header>
      <div className="content">
        <section className="reserved">
          <div className="section">
            <div className="current">지금까지 절약한 에너지</div>
          </div>
          <div className="energy highlight">
            <span className="number">8,883</span>
            <span className="wh">kWh</span>
          </div>
          <div className="check">
            <div className="lable">에너지 절약 상태 — Good</div>
          </div>
        </section>
        <section className="graph">
          <div className="header">에너지 절약량</div>
          <Graph />
        </section>
        <section className="compare">
          <div className="container">
            <div className="header">2021년 총 절약량</div>
            <div className="value">
              <span className="number">10,100</span>
              <span className="wh">kWh</span>
            </div>
          </div>
          <div className="container">
            <div className="header">2022년 총 절약량</div>
            <div className="value highlight">
              <span className="number">14,100</span>
              <span className="wh">kWh</span>
            </div>
          </div>
        </section>
        <section className="devices">
          <div className="header">기기</div>
          <div className="container">
            {Devices.map(({ id, ...metas }) => (
              <Card key={id} cardId={id} {...metas} />
            ))}
          </div>
        </section>
        <section className="more">
          <div className="container">
            <div className="box">
              <div className="sub">더 알아보기</div>
              <div className="title">이 앱의 스토리를 알고 싶으신가요?</div>
              <div className="button-box">
                <a href="/promotion" className="button">
                  보러 가기
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <footer>
        <div className="container">
          <div className="copyright">© CTQ from Seil.</div>
          <div className="github">
            <a href="https://github.com/amclio/energy-refactor">Sources</a>
          </div>
        </div>
      </footer>
    </>
  )
}
