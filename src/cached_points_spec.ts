import Point from "./point";
import CachedPoints from './cached_points'

describe("ActivePoints", () => {
    it("adds neighbors when you add a point", () => {
        const cache = new CachedPoints()
        const point = new Point(0, 1, 0, 1, true)
        expect(Object.keys(cache.cached).length).toEqual(0)
        cache.addOrUpdate(point)
        expect(Object.keys(cache.cached).length).toEqual(9)
    });

    it("reading a point doesn't change the count of cached items", () => {
        const cache = new CachedPoints()
        const point = new Point(0, 1, 0, 1, true)
        expect(Object.keys(cache.cached).length).toEqual(0)
        cache.addOrUpdate(point)
        expect(Object.keys(cache.cached).length).toEqual(9)
        cache.addOrUpdate(point)
        expect(Object.keys(cache.cached).length).toEqual(9)
    });

    it("calculates count of siblings who are selected", () => {
        const cache = new CachedPoints()
        const point = new Point(0, 1, 0, 1, true)
        cache.addOrUpdate(point)
        const point2 = new Point(1, 1, 0, 1, true)
        cache.addOrUpdate(point2)
        const point3 = new Point(0, 1, 1, 1, true)
        cache.addOrUpdate(point3)
        expect(cache.countOfSelectedSiblings(point)).toBe(2)
    });
});
