import type { LoaderFunction } from '@remix-run/cloudflare'
import type { CardProps } from '~/components/main/card'

import { useLoaderData } from '@remix-run/react'
import Chart from 'chart.js/auto'
import { useEffect, useRef, useState } from 'react'
import { useInterval } from 'react-use'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import styles from '~/styles/processed/main.css'

import { Card as CardContainer } from '~/components/main/card'
import { StatusLabel } from '~/components/main/status'
import {
  accumulatedSpendingState,
  devicesStateFamily,
  entireUsageState,
  spendingTextsState,
} from '~/stores/devices'

interface Device {
  id: number
  name: string
  spending: number
  imageSrc: string
}

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

function Graph({ stat, unit }: { stat: number; unit: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [chart, setChart] = useState<Chart>()

  useEffect(() => {
    if (ref.current) {
      var L1x = ['5월', '6월', '7월', '8월', '9월', '10월']
      var L1y = [150, 180, 250, 280, 220, 300]
      // var L2y = [789, 987, 876, 765, 654, 543]
      // var L1y = [0, 0, 0, 0, 0, 0]
      var L2y = [0, 0, 0, 0, 0, 0]

      const chart = new Chart(ref.current, {
        // type: 'line',
        type: 'bar',
        data: {
          labels: L1x, //x축
          datasets: [
            {
              label: '평균', //그래프 이름
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

      setChart(chart)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (chart) {
      chart.data.datasets[1].data[5] = stat
      chart.data.datasets[1].label = `2022년 (${unit})`
    }
    chart?.update()
  }, [chart, stat, unit])

  return <canvas id="LineG" ref={ref} style={{ width: '100%' }}></canvas>
}

function Card({ cardId, ...props }: { cardId: number } & CardProps) {
  const [cardState, setCardState] = useRecoilState(devicesStateFamily(cardId))

  const setEntireUsage = useSetRecoilState(entireUsageState)
  const [isLoaded, setLoaded] = useState(false)

  const handleClick = () => {
    setEntireUsage((curr) =>
      !cardState.status ? curr + props.spending : curr - props.spending
    )
    setCardState((state) => ({ ...state, status: !cardState.status }))
  }

  useEffect(() => {
    setCardState((status) => ({ ...status, spending: props.spending }))
  }, [props.spending, setCardState])

  useEffect(() => {
    if (cardState.spending && cardState.status !== null && !isLoaded) {
      setEntireUsage((curr) =>
        cardState.status ? curr + props.spending : curr
      )
      setLoaded(true)
    }
  }, [
    cardState.spending,
    cardState.status,
    isLoaded,
    props.spending,
    setEntireUsage,
  ])

  return (
    <CardContainer
      isActive={cardState.status || false}
      onClick={handleClick}
      {...props}
    />
  )
}

export default function Index() {
  const devices = useLoaderData<Device[]>()
  const totalWh = devices.reduce((prev, curr) => prev + curr.spending, 0)

  const setSpending = useSetRecoilState(accumulatedSpendingState)

  const entireUsage = useRecoilValue(entireUsageState)
  const {
    preserved: { text, unit, message },
  } = useRecoilValue(spendingTextsState)

  useInterval(() => {
    setSpending(({ spending, preserved }) => ({
      spending: spending + entireUsage,
      preserved: preserved + (totalWh - entireUsage),
    }))
  }, 1 * 1000)

  const isGood: 'good' | null = totalWh * (1 / 5) > entireUsage ? 'good' : null
  const isWarning: 'warning' | null =
    totalWh * (1 / 5) < entireUsage && totalWh * (4 / 5) > entireUsage
      ? 'warning'
      : null
  const isDanger: 'danger' | null =
    totalWh * (4 / 5) < entireUsage ? 'danger' : null

  let currentState = isGood || isWarning || isDanger

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
          <div className={`energy highlight ${currentState}`}>
            <span className="number">{message || text}</span>
            <span className="wh">{unit}</span>
          </div>
          <div className="check">
            <StatusLabel state={currentState || 'good'} />
          </div>
        </section>
        <section className="graph">
          <div className="header">에너지 절약량</div>
          <Graph stat={text} unit={unit} />
        </section>
        <section className="compare">
          <div className="container">
            <div className="header">2021년 총 절약량</div>
            <div className="value">
              <span className="number">N/A</span>
            </div>
          </div>
          <div className="container">
            <div className="header">2022년 총 절약량</div>
            <div className={`value highlight ${currentState}`}>
              <span className="number">{message || text}</span>
              <span className="wh">{unit}</span>
            </div>
          </div>
        </section>
        <section className="devices">
          <div className="header">기기</div>
          <div className="container">
            {devices.map(({ id, ...metas }) => (
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

export const loader: LoaderFunction = () => {
  const Devices: Device[] = [
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

  return Devices
}
