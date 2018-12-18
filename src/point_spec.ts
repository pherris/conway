import Point from "./point";

describe("Point", () => {
    it("has neighbors", () => {
        const point = new Point(0, 1, 0, 1, true)
        expect(point.neighbors().length).toEqual(8)
    });

    it("can describe its coordinates", () => {
        const x = 0
        const y = 0
        const point = new Point(x, 1, y, 1, true)
        expect(point.coordinates).toEqual(`${x}:1:${y}:1`)
    });

    it("knows its neighbors locations and wraps", () => {
        const point = new Point(Point.MIN, 1, Point.MIN, 1, true)
        const neighbors = point.neighbors()
        const topLeft = neighbors[0]
        const top = neighbors[1]
        const topRight = neighbors[2]
        const left = neighbors[3]
        const right = neighbors[4]
        const bottomLeft = neighbors[5]
        const bottom = neighbors[6]
        const bottomRight = neighbors[7]

        // wraps both x and y
        expect(topLeft).toEqual([Point.MAX, Point.MAX_MULTIPLIER, Point.MAX, Point.MAX_MULTIPLIER].join(':'))
        expect(top).toEqual([Point.MIN, 1, Point.MAX, Point.MAX_MULTIPLIER].join(':'))
        expect(topRight).toEqual([1, 1, Point.MAX, Point.MAX_MULTIPLIER].join(':'))
        expect(left).toEqual([Point.MAX, Point.MAX_MULTIPLIER, Point.MIN, 1].join(':'))
        expect(right).toEqual([1, 1, 0, 1].join(':'))
        expect(bottomLeft).toEqual([Point.MAX, Point.MAX_MULTIPLIER, 1, 1].join(':'))
        expect(bottom).toEqual([Point.MIN, 1, 1, 1].join(':'))
        expect(bottomRight).toEqual([1, 1, 1, 1].join(':'))
    });
});
