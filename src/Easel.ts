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

    public static Red = new Color(255,0,0);
    public static Green = new Color(0,255,0);
    public static Blue = new Color(0,0,255);

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
}

class Polygon {
    private static idcounter: number = 0
    kind: PolygonType = PolygonType.Polygon
    name: string = 'untitled'
    id: number

    vertices: Array<Point>

    fillColor: Color = new Color(200, 0, 100)
    strokeColor: Color = new Color(0, 0, 0)

    constructor(kind: PolygonType, name: string) {
        this.kind = kind
        this.name = name

        this.vertices = new Array<Point>()
        this.id = Polygon.idcounter
        Polygon.idcounter += 1
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

        const vert_tmp = this.vertices.slice()
        vert_tmp.push(this.vertices[0])

        for (let i = 0; i < vert_tmp.length - 1; i++) {
            const p0 = vert_tmp[i]
            const p1 = vert_tmp[i + 1]

            const v0 = new Point(p0.x - p.x, p0.y - p.y)
            const v1 = new Point(p1.x - p.x, p1.y - p.y)

            const sign = Math.sign(v0.x * v1.y - v0.y * v1.x)
            theta_sum += sign * Math.acos((v0.x * v1.x + v0.y * v1.y) / v0.length() / v1.length())
        }

        return Math.trunc(theta_sum) !== 0
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

        const N = 24
        for (let i = 0; i < N; i++) {
            const cx = radius * Math.cos(i / N * 2 * Math.PI) + x
            const cy = radius * Math.sin(i / N * 2 * Math.PI) + y
            this.vertices.push(new Point(cx, cy))
        }
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

        this.vertices.push(new Point(x, y))
        this.vertices.push(new Point(x + width, y))
        this.vertices.push(new Point(x + width, y + height))
        this.vertices.push(new Point(x, y + height))
    }
}

class Easel {
    context!: CanvasRenderingContext2D
    canvas!: HTMLCanvasElement
    shapes: Array<Polygon>

    constructor() {
        this.shapes = []
    }

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
        this.context.lineWidth = 3
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (let shape of this.shapes) {
            shape.draw(this.context)
        }
    }

    pick(point: Point) {
        for (let i = 0; i < this.shapes.length; i++)
            this.shapes[i].strokeColor = new Color(0, 0, 0)

        for (let i = this.shapes.length - 1; 0 <= i; i--) {

            if (this.shapes[i].contain(point)) {
                this.shapes[i].strokeColor = new Color(255, 0, 0)
                break
            }
        }
    }
}

export { Easel, Color, Rectangle, Ellipse, Point }