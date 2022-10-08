import Chart from 'chart.js/auto'
import { useEffect, useRef } from 'react'

import styles from '~/styles/main.css'

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
            <div className="card active">
              <div className="name">전등</div>
              <div className="status">켜짐</div>

              <div className="icon">
                <img src="./assets/images/lamp.png" alt="Lamp" />
              </div>
            </div>
            <div className="card">
              <div className="name">TV</div>
              <div className="status">꺼짐</div>
              <div className="icon">
                <img src="./assets/images/tv.png" alt="Television" />
              </div>
            </div>
            <div className="card">
              <div className="name">에어컨</div>
              <div className="status">꺼짐</div>

              <div className="icon">
                <img
                  src="./assets/images/air-conditioner.png"
                  alt="Air conditioner"
                />
              </div>
            </div>
            <div className="card">
              <div className="name">선풍기</div>
              <div className="status">꺼짐</div>

              <div className="icon">
                <img src="./assets/images/fan.png" alt="Electric fan" />
              </div>
            </div>
            <div className="card">
              <div className="name">충전기</div>
              <div className="status">꺼짐</div>

              <div className="icon">
                <img src="./assets/images/charger.png" alt="Charger" />
              </div>
            </div>
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
