// This point represents
export class Point {
    private x: bigint;
    private y: bigint;
    private selected: boolean;
    private MIN: bigint = BigInt(0);
    private MAX: bigint = BigInt(1.8446744e+19);

    constructor(x: bigint, y: bigint, selected: boolean) {
        this.x = x;
        this.y = y;
        this.selected = selected;
    }

    neighbors(): number[][] {
        return [[1, 3]]
    }

    private topLeftNeighbor(): Array<bigint> {
        return [this.nextHigherCoordinate(this.x), this.nextLowerCoordinate(this.y)]
    }

    private nextHigherCoordinate(coord: bigint): bigint {
        return (coord == this.MAX) ? this.MIN : coord + BigInt(1)
    }

    private nextLowerCoordinate(coord: bigint): bigint {
        return (coord == this.MIN) ? this.MAX : coord - BigInt(1)
    }
}
