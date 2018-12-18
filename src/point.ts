// represents a point in the grid which is aware of the coordinates of each of its neighbors
export default class Point {
    static MIN: number = 0
    static MAX: number = Number.MAX_SAFE_INTEGER // 0 counts
    static MAX_MULTIPLIER: number = 2048 // there are 2048 of Number.MAX_SAFE_INTEGER in 2^64

    private x: number
    private y: number
    private x_multiplier: number
    private y_multiplier: number
    public selected: boolean

    static cacheKey(x, x_multiplier, y, y_multiplier): string {
        return [x, x_multiplier, y, y_multiplier].join(':')
    }

    constructor(x: number, x_multiplier: number, y: number, y_multiplier: number, selected: boolean) {
        this.x = x;
        this.y = y;
        this.x_multiplier = x_multiplier
        this.y_multiplier = y_multiplier
        this.selected = selected;
    }

    get coordinates(): string {
        return Point.cacheKey(this.x, this.x_multiplier, this.y, this.y_multiplier)
    }

    // the helpers return [[x, x_multiplier], [y, y_multiplier]]
    neighbors(): Array<Array<Array<number>>> {
        return [
            this.topLeftNeighbor(),
            this.topNeighbor(),
            this.topRightNeighbor(),
            this.leftNeighbor(),
            this.rightNeighbor(),
            this.bottomLeftNeighbor(),
            this.bottomNeighbor(),
            this.bottomRightNeighbor()
        ]
    }

    private bottomLeftNeighbor(): Array<Array<number>> {
        return [this.nextLowerCoordinate(this.x, this.x_multiplier), this.nextHigherCoordinate(this.y, this.y_multiplier)]
    }

    private bottomNeighbor(): Array<Array<number>> {
        return [[this.x, this.x_multiplier], this.nextHigherCoordinate(this.y, this.y_multiplier)]
    }

    private bottomRightNeighbor(): Array<Array<number>> {
        return [this.nextHigherCoordinate(this.x, this.x_multiplier), this.nextHigherCoordinate(this.y, this.y_multiplier)]
    }

    private leftNeighbor(): Array<Array<number>> {
        return [this.nextLowerCoordinate(this.x, this.x_multiplier), [this.y, this.y_multiplier]]
    }

    private rightNeighbor(): Array<Array<number>> {
        return [this.nextHigherCoordinate(this.x, this.x_multiplier), [this.y, this.y_multiplier]]
    }

    private topLeftNeighbor(): Array<Array<number>> {
        return [this.nextLowerCoordinate(this.x, this.x_multiplier), this.nextLowerCoordinate(this.y, this.y_multiplier)]
    }

    private topNeighbor(): Array<Array<number>> {
        return [[this.x, this.x_multiplier], this.nextLowerCoordinate(this.y, this.y_multiplier)]
    }

    private topRightNeighbor(): Array<Array<number>> {
        return [this.nextHigherCoordinate(this.x, this.x_multiplier), this.nextLowerCoordinate(this.y, this.y_multiplier)]
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
