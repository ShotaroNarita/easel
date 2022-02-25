class Option<T>{
    found: boolean
    value!: T

    constructor() {
        this.found = false
    }

    register(value: T) {
        this.found = true
        this.value = value
    }
}

class Result<T, E>{
    succeed: boolean
    value!: T
    message!: E

    constructor() {
        this.succeed = false
    }

    register(value: T) {
        this.succeed = true
        this.value = value
    }

    failure(message: E) {
        this.succeed = false
        this.message = message
    }
}

class Color {
    red: number
    green: number
    blue: number
    alpha: number

    constructor(red: number, green: number, blue: number, alpha: number = 1.0) {
        this.red = Math.floor(Number(red))
        this.green = Math.floor(Number(green))
        this.blue = Math.floor(Number(blue))
        this.alpha = alpha
    }

    decralation() {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
    }

    pale(): Color {
        return new Color(this.red, this.green, this.blue, 0.1)
    }

    public static Red = new Color(255, 0, 0);
    public static Green = new Color(0, 255, 0);
    public static Blue = new Color(0, 0, 255);
    public static Black = new Color(0, 0, 0);
    public static White = new Color(255, 255, 255);



}

enum PolygonType {
    Polygon = 'polygon',
    Rectangle = 'rectangle',
    Ellipse = 'ellipse'
}

class Point {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    toString(){
        return `(${this.x}, ${this.y})`
    }
}

class Polygon {
    // private static idcounter: number = 0
    kind: PolygonType = PolygonType.Polygon
    name: string = 'untitled'
    // id: number

    vertices: Array<Point>

    fillColor: Color = new Color(200, 0, 100)
    strokeColor: Color = new Color(0, 0, 0)

    constructor(kind: PolygonType, name: string) {
        this.kind = kind
        this.name = name

        this.vertices = new Array<Point>()
    }

    draw(context: CanvasRenderingContext2D) {
        const p0 = this.vertices[0]

        context.beginPath()
        context.fillStyle = this.fillColor.decralation()
        context.moveTo(p0.x, p0.y)
        for (let p of this.vertices) context.lineTo(p.x, p.y)
        // context.lineTo(p0.x, p0.y)
        context.closePath()
        context.fill()

        context.beginPath()
        context.strokeStyle = this.strokeColor.decralation()
        context.moveTo(p0.x, p0.y)
        for (let p of this.vertices) context.lineTo(p.x, p.y)
        // context.lineTo(p0.x, p0.y)
        context.closePath()

        context.stroke()
    }

    contain(p: Point) {
        let theta_sum = 0

        const vert = this.vertices.slice()
        vert.push(this.vertices[0])

        for (let i = 0; i < vert.length - 1; i++) {
            const p0 = vert[i]
            const p1 = vert[i + 1]

            const v0 = new Point(p0.x - p.x, p0.y - p.y)
            const v1 = new Point(p1.x - p.x, p1.y - p.y)

            const sign = Math.sign(v0.x * v1.y - v0.y * v1.x)
            theta_sum += sign * Math.acos((v0.x * v1.x + v0.y * v1.y) / v0.length() / v1.length())
        }

        return Math.trunc(theta_sum) !== 0
    }

    locate(position: Point) {
        // let center = new Point(0,0)
        // this.vertices.forEach(p => {center = new Point(center.x + p.x, center.y + p.y)})
        // center = new Point(center.x / this.vertices.length, center.y / this.vertices.length)

        // this.vertices = this.vertices.map(p => {return new Point(p.x - center.x + position.x, p.y - center.y + position.y)})
    }

    center(){
        let c = new Point(0,0)
        this.vertices.forEach(p => {c = new Point(c.x + p.x, c.y + p.y)})
        c = new Point(c.x / this.vertices.length, c.y / this.vertices.length)
        c = new Point(Math.floor(c.x), Math.floor(c.y))
        return c
    }
}

class Ellipse extends Polygon {
    x: number
    y: number
    radius: number

    constructor(x: number, y: number, radius: number) {
        super(PolygonType.Ellipse, 'untitled')
        this.x = x
        this.y = y
        this.radius = radius

        this.locate(new Point(x, y))
        // const N = 24
        // for (let i = 0; i < N; i++) {
        //     const cx = radius * Math.cos(i / N * 2 * Math.PI) + x
        //     const cy = radius * Math.sin(i / N * 2 * Math.PI) + y
        //     this.vertices.push(new Point(cx, cy))
        // }
    }

    //overwrite
    draw(context: CanvasRenderingContext2D): void {
        context.beginPath()
        context.fillStyle = this.fillColor.decralation()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.closePath()
        context.fill()

        context.beginPath()
        context.strokeStyle = this.strokeColor.decralation()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.closePath()
        context.stroke()
    }

    locate(position: Point): void {
        this.x = position.x
        this.y = position.y
        this.vertices = []

        const N = 24
        for (let i = 0; i < N; i++) {
            const cx = this.radius * Math.cos(i / N * 2 * Math.PI) + this.x
            const cy = this.radius * Math.sin(i / N * 2 * Math.PI) + this.y
            this.vertices.push(new Point(cx, cy))
        }
    }
}

class Rectangle extends Polygon {
    x: number
    y: number
    width: number
    height: number

    constructor(x: number, y: number, width: number, height: number) {
        super(PolygonType.Rectangle, 'untitled')

        this.x = x
        this.y = y
        this.width = width
        this.height = height

        this.locate(new Point(x + width / 2, y + height / 2))
    }

    locate(position: Point): void {
        this.x = position.x - this.width / 2
        this.y = position.y - this.height / 2
        // this.miomon = onaka.ippai

        this.vertices = []
        this.vertices.push(new Point(this.x, this.y))
        this.vertices.push(new Point(this.x + this.width, this.y))
        this.vertices.push(new Point(this.x + this.width, this.y + this.height))
        this.vertices.push(new Point(this.x, this.y + this.height))
    }
}

type ShapeID = number

class Easel {
    context!: CanvasRenderingContext2D
    canvas!: HTMLCanvasElement

    idcounter: number = 0
    shapes: Map<ShapeID, Polygon>
    order: Array<ShapeID>

    constructor() {
        this.shapes = new Map()
        this.order = []
    }

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
        this.context.lineWidth = 3
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        for (let id of this.order) {
            this.shapes.get(id)?.draw(this.context)
        }
    }

    pick(point: Point): Option<number> {
        const option = new Option<number>()

        for (let id of this.order.slice().reverse()) {
            if (this.shapes.has(id)) {
                const shape = this.shapes.get(id) as Polygon
                if (shape.contain(point)) {
                    option.register(id)
                    break
                }
            }
        }

        return option
    }

    register(shape: Polygon): ShapeID {
        this.shapes.set(this.idcounter, shape)
        this.order.push(this.idcounter)
        this.idcounter++
        return this.idcounter - 1
    }

    unregister(id: ShapeID){
        this.shapes.delete(id)
    }

    place(id: number, point: Point) {
        if (this.shapes.has(id)) {
            const shapes = this.shapes.get(id) as Polygon
            shapes.locate(point)
        }
    }

    focus(id: ShapeID, color = Color.Red) {
        const shape = this.shapes.get(id) as Polygon
        shape.strokeColor = color
        this.shapes.set(id, shape)
    }

    blur() {
        this.shapes.forEach((shape, id) => {
            shape.strokeColor = Color.Black
            this.shapes.set(id, shape)
        })
    }
}

export { Easel, Color, Rectangle, Ellipse, Point, Polygon }