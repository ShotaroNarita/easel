import React from 'react'
import './App.css'

import { Easel, Color, Ellipse, Rectangle, Point, Polygon } from './Easel'

class DragHandle {
  enabled: boolean = false

  current: Point = new Point(0, 0)
  offset: Point = new Point(0,0)
  targetID: number = -1

  open(targetID: number, targetShape: Polygon, clickedPoint: Point){
    this.enabled = true
    this.targetID = targetID
    const center = targetShape.center()
    this.offset = new Point(center.x - clickedPoint.x, center.y - clickedPoint.y)
  }

  close(){
    this.enabled = false
  }
}

interface AppState {
  canvasID: string
  easel: Easel
  draghandle: DragHandle
}

class App extends React.Component {
  state: AppState

  constructor(prop: any) {
    super(prop)
    this.state = { easel: new Easel(), canvasID: 'canvas', draghandle: new DragHandle() }
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
        <canvas id={this.state.canvasID}
          onMouseMove={
            (ev: React.MouseEvent) => {
              const x = ev.nativeEvent.offsetX
              const y = ev.nativeEvent.offsetY
              const easel = this.state.easel

              const draghandle = this.state.draghandle
              if (draghandle.enabled) {
                draghandle.current = new Point(x + draghandle.offset.x, y + draghandle.offset.y)
                easel.place(draghandle.targetID, draghandle.current)
              } else {
                const answer = easel.pick(new Point(x, y))
                easel.blur()

                if (answer.found) {
                  const id = answer.value
                  easel.focus(id, new Color(200, 10, 24))
                }
              }

              this.setState({ easel, draghandle })
              this.state.easel.draw()
            }
          }

          onMouseLeave={
            (ev: React.MouseEvent) => {
              const easel = this.state.easel
              const draghandle = this.state.draghandle

              draghandle.close()
              easel.blur()

              this.setState({ easel, draghandle })
              this.state.easel.draw()
            }
          }

          onMouseUp={
            (ev: React.MouseEvent) => {
              const x = ev.nativeEvent.offsetX
              const y = ev.nativeEvent.offsetY
              const easel = this.state.easel

              const draghandle = this.state.draghandle
              draghandle.enabled = false
              draghandle.close()

              const answer = easel.pick(new Point(x, y))
              easel.blur()

              if (answer.found) {
                const id = answer.value
                easel.focus(id)
              }

              this.setState({ easel, draghandle })
              this.state.easel.draw()
            }
          }

          onMouseDown={
            (ev: React.MouseEvent) => {
              const x = ev.nativeEvent.offsetX
              const y = ev.nativeEvent.offsetY
              const easel = this.state.easel

              const answer = easel.pick(new Point(x, y))
              const draghandle = this.state.draghandle

              if (answer.found) {
                const id = answer.value

                draghandle.open(id, easel.shapes.get(id) as Polygon, new Point(x, y))
                draghandle.current = new Point(x, y)
                draghandle.targetID = id

                easel.focus(id)
              }

              this.setState({ easel, draghandle })
              this.state.easel.draw()
            }
          }

          width="600" height="600"></canvas>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Kind</th>
              <th>Name</th>
              <th>Position</th>
            </tr>
          </thead>

          <tbody>
            {
              Array.from(this.state.easel.shapes.entries()).map(info => {
                const id = info[0]
                const shape = info[1]
                return <tr key={id}><td>{id}</td><td>{shape.kind}</td><td>{shape.name}</td><td>{shape.center().toString()}</td></tr>
              })
            }
          </tbody>
        </table>

      </div>
    )
  }
}

export default App
