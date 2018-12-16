import Point from "./point";

describe("Point", () => {
    it("has neighbors", () => {
        const point = new Point(BigInt(0), BigInt(0), true)
        expect(point.neighbors().length).toEqual(8)
    });

    it("can describe its coordinates", () => {
        const x = BigInt(0)
        const y = BigInt(0)
        const point = new Point(x, y, true)
        expect(point.coordinates).toEqual([x, y])
    });

    it("knows its neighbors locations and wraps", () => {
        const x = BigInt(0)
        const y = BigInt(0)
        const point = new Point(x, y, true)
        const neighbors = point.neighbors()
        expect(neighbors[0]).toEqual([BigInt(18446744073709551616), BigInt(18446744073709551616)]);
    });
});
