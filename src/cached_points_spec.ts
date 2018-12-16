import Point from "./point";
import CachedPoints from './cached_points'

describe("ActivePoints", () => {
    it("adds neighbors when you add a point", () => {
        const cache = new CachedPoints()
        const point = new Point(BigInt(0), BigInt(0), true)
        expect(cache.cached.length).toEqual(0)
        cache.addOrUpdate(point)
        expect(cache.cached.length).toEqual(9)
    });

    it("readding a point doesn't change the count of cached items", () => {
        const cache = new CachedPoints()
        const point = new Point(BigInt(0), BigInt(0), true)
        expect(cache.cached.length).toEqual(0)
        cache.addOrUpdate(point)
        expect(cache.cached.length).toEqual(9)
        cache.addOrUpdate(point)
        expect(cache.cached.length).toEqual(9)
    });

    it("find takes coordinates and finds an item in the cache", () => {
        const cache = new CachedPoints()
        const point = new Point(BigInt(0), BigInt(0), true)

        cache.addOrUpdate(point)
        expect(cache.find(point.coordinates)).toBe(point)
    });

    it("find returns nil if the item wasnt found", () => {
        const cache = new CachedPoints()
        expect(cache.find([BigInt(0), BigInt(0)])).toBe(null)
    });

    it("calculates count of siblings who are selected", () => {
        const cache = new CachedPoints()
        const point = new Point(BigInt(0), BigInt(0), true)
        cache.addOrUpdate(point)
        const point2 = new Point(BigInt(1), BigInt(0), true)
        cache.addOrUpdate(point2)
        const point3 = new Point(BigInt(0), BigInt(1), true)
        cache.addOrUpdate(point3)
        expect(cache.countOfSelectedSiblings(point)).toBe(2)
    });

    it("cleanRemoved removes the cache of removed items", () => {
        const cache = new CachedPoints()
        const point = new Point(BigInt(0), BigInt(0), true)
        cache.addOrUpdate(point)
        expect(cache.cached.length).toBe(9)
        cache.remove(point)
        expect(cache.cached.length).toBe(8)
        expect(cache.removedItems.length).toBe(1)
        cache.cleanRemoved()
        expect(cache.removedItems.length).toBe(0)
    });
});
