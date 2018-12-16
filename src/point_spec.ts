import { Point } from "./point";

describe("Point", () => {

    it("has neighbors", () => {

        let point = new Point(BigInt(0), BigInt(0), true);

        expect(point.neighbors().length).toEqual(8);
    });
});