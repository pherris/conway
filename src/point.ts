// represents a point in the grid which is aware of the coordinates of each of its neighbors
export default class Point {
    private MIN: bigint = BigInt(0);
    private MAX: bigint = BigInt(18446744073709551616);

    private x: bigint;
    private y: bigint;
    public selected: boolean;

    constructor(x: bigint, y: bigint, selected: boolean) {
        this.x = x;
        this.y = y;
        this.selected = selected;
    }

    get coordinates(): bigint[] {
        return [this.x, this.y]
    }

    neighbors(): bigint[][] {
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

    private bottomLeftNeighbor(): Array<bigint> {
        return [this.nextLowerCoordinate(this.x), this.nextHigherCoordinate(this.y)]
    }

    private bottomNeighbor(): Array<bigint> {
        return [this.x, this.nextHigherCoordinate(this.y)]
    }

    private bottomRightNeighbor(): Array<bigint> {
        return [this.nextHigherCoordinate(this.x), this.nextHigherCoordinate(this.y)]
    }

    private leftNeighbor(): Array<bigint> {
        return [this.nextLowerCoordinate(this.x), this.y]
    }

    private rightNeighbor(): Array<bigint> {
        return [this.nextHigherCoordinate(this.x), this.y]
    }

    private topLeftNeighbor(): Array<bigint> {
        return [this.nextLowerCoordinate(this.x), this.nextLowerCoordinate(this.y)]
    }

    private topNeighbor(): Array<bigint> {
        return [this.x, this.nextLowerCoordinate(this.y)]
    }

    private topRightNeighbor(): Array<bigint> {
        return [this.nextHigherCoordinate(this.x), this.nextLowerCoordinate(this.y)]
    }

    private nextHigherCoordinate(coord: bigint): bigint {
        return (coord == this.MAX) ? this.MIN : coord + BigInt(1)
    }

    private nextLowerCoordinate(coord: bigint): bigint {
        return (coord == this.MIN) ? this.MAX : coord - BigInt(1)
    }
}
