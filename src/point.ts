// represents a point in the grid which is aware of the coordinates of each of its neighbors
export default class Point {
    static MIN: number = 0
    static MAX: number = Number.MAX_SAFE_INTEGER // 0 counts
    static MAX_MULTIPLIER: number = 2048 // there are 2048 of Number.MAX_SAFE_INTEGER in 2^64

    private x: number
    private y: number
    private x_multiplier: number
    private y_multiplier: number
    private topLeftKey: string
    private topKey: string
    private topRightKey: string
    private leftKey: string
    private rightKey: string
    private bottomLeftKey: string
    private bottomKey: string
    private bottomRightKey: string
    private key: string
    public selected: boolean

    constructor(x: number, x_multiplier: number, y: number, y_multiplier: number, selected: boolean) {
        this.x = x;
        this.y = y;
        this.x_multiplier = x_multiplier
        this.y_multiplier = y_multiplier
        this.selected = selected;

        // cache some of the lookups
        this.topLeftKey = this.topLeftNeighbor().join(':')
        this.topKey = this.topNeighbor().join(':')
        this.topRightKey = this.topRightNeighbor().join(':')
        this.leftKey = this.leftNeighbor().join(':')
        this.rightKey = this.rightNeighbor().join(':')
        this.bottomLeftKey = this.bottomLeftNeighbor().join(':')
        this.bottomKey = this.bottomNeighbor().join(':')
        this.bottomRightKey = this.bottomRightNeighbor().join(':')

        this.key = [this.x, this.x_multiplier, this.y, this.y_multiplier].join(':')
    }

    get coordinates(): string {
        return this.key
    }

    // the helpers return [[x, x_multiplier], [y, y_multiplier]]
    neighbors(): Array<string> {
        return [
            this.topLeftKey,
            this.topKey,
            this.topRightKey,
            this.leftKey,
            this.rightKey,
            this.bottomLeftKey,
            this.bottomKey,
            this.bottomRightKey
        ]
    }

    private bottomLeftNeighbor(): Array<number> {
        return this.nextLowerCoordinate(this.x, this.x_multiplier).concat(this.nextHigherCoordinate(this.y, this.y_multiplier))
    }

    private bottomNeighbor(): Array<number> {
        return [this.x, this.x_multiplier].concat(this.nextHigherCoordinate(this.y, this.y_multiplier))
    }

    private bottomRightNeighbor(): Array<number> {
        return this.nextHigherCoordinate(this.x, this.x_multiplier).concat(this.nextHigherCoordinate(this.y, this.y_multiplier))
    }

    private leftNeighbor(): Array<number> {
        return this.nextLowerCoordinate(this.x, this.x_multiplier).concat([this.y, this.y_multiplier])
    }

    private rightNeighbor(): Array<number> {
        return this.nextHigherCoordinate(this.x, this.x_multiplier).concat([this.y, this.y_multiplier])
    }

    private topLeftNeighbor(): Array<number> {
        return this.nextLowerCoordinate(this.x, this.x_multiplier).concat(this.nextLowerCoordinate(this.y, this.y_multiplier))
    }

    private topNeighbor(): Array<number> {
        return [this.x, this.x_multiplier].concat(this.nextLowerCoordinate(this.y, this.y_multiplier))
    }

    private topRightNeighbor(): Array<number> {
        return this.nextHigherCoordinate(this.x, this.x_multiplier).concat(this.nextLowerCoordinate(this.y, this.y_multiplier))
    }

    private nextHigherCoordinate(coord: number, multiplier: number): Array<number> {
        if (coord == Point.MAX) {
            multiplier = multiplier + 1
            coord = Point.MIN
        } else {
            coord = coord + 1
        }

        if (multiplier > Point.MAX_MULTIPLIER) {
            multiplier = 0
        }
        return [coord, multiplier]
    }

    private nextLowerCoordinate(coord: number, multiplier: number): Array<number> {
        if (coord == Point.MIN) {
            multiplier = multiplier - 1
            coord = Point.MAX
        } else {
            coord = coord - 1
        }

        if (multiplier <= 0) {
            multiplier = Point.MAX_MULTIPLIER
        }
        return [coord, multiplier]
    }
}
