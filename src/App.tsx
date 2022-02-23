import React from 'react'
import './App.css'

import { Easel, Color, Ellipse, Rectangle, Point } from './Easel'

interface AppState {
  canvasID: string
  easel: Easel
}

class App extends React.Component {
  state: AppState

  constructor(prop: any) {
    super(prop)
    this.state = { easel: new Easel(), canvasID: 'canvas' }
  }

  componentDidMount() {
    const canvas = document.querySelector(`#${this.state.canvasID}`) as HTMLCanvasElement
    // const context = canvas.getContext('2d') as CanvasRenderingContext2D

    const easel = this.state.easel
    easel.init(canvas)

    //
    const circles = [
      { x: 150, y: 150, radius: 100, color: Color.Green },
      { x: 120, y: 400, radius: 80, color: new Color(0, 100, 255) },
      { x: 250, y: 150, radius: 140, color: new Color(240, 0, 227) },
    ]

    for (let circle of circles) {
      const e = new Ellipse(circle.x, circle.y, circle.radius)
      e.fillColor = circle.color
      easel.register(e)
    }
    
    const s1 = new Rectangle(100, 100, 300, 400)
    s1.fillColor = new Color(255, 0, 0, 0.3)
    easel.register(s1)
    //

    this.setState({ easel })
    this.state.easel.draw()
  }

  render() {
    return (
      <div>
        <canvas id={this.state.canvasID} onMouseMove={
          (ev: React.MouseEvent) => {
            const x = ev.nativeEvent.offsetX
            const y = ev.nativeEvent.offsetY
            const easel = this.state.easel

            easel.pick(new Point(x, y))
            this.setState({ easel })
            this.state.easel.draw()
          }} width="600" height="600"></canvas>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Kind</th>
              <th>Name</th>
            </tr>
          </thead>

          <tbody>
            {
              Array.from(this.state.easel.shapes.entries()).map(info => {
                const id = info[0]
                const shape = info[1]
                return <tr key={id}><td>{id}</td><td>{shape.kind}</td><td>{shape.name}</td></tr>
              })
            }
          </tbody>
        </table>

      </div>
    )
  }
}

export default App
