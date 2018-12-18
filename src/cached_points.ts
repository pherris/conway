import Point from "./point";

export default class CachedPoints {
    cache: Record<string, Point> = {}
    private _removed: Record<string, Point> = {}

    constructor() { }

    get cached(): Record<string, Point> {
        return this.cache
    }

    get visibleItems(): Object {
        // TODO hold visible ones and return them
        return {}
    }

    get removedItems(): Object {
        return this._removed
    }

    public cleanRemoved(): void {
        this._removed = {}
    }

    // add an item into the cache, has a side effect of hydrating siblings - could be more of a pure function
    public addOrUpdate(point: Point): void {
        if (!this.cache[point.coordinates]) {
            this.cache[point.coordinates] = point
        }
        this.cache[point.coordinates].selected = point.selected

        point.neighbors().forEach((neighborCoordinates) => {
            const [[x, x_multiplier], [y, y_multiplier]] = neighborCoordinates
            // if our neighbor already exists, we've nothing to do
            const cacheKey = Point.cacheKey(x, x_multiplier, y, y_multiplier)
            if (this.cache[cacheKey]) {
                return
            }
            this.cache[cacheKey] = new Point(x, x_multiplier, y, y_multiplier, false)
        })
    }

    // removes an item from the cache and adds to the removed list
    public remove(point: Point): boolean {
        this.cache[point.coordinates]

        if (!this.cache[point.coordinates]) {
            return false
        }

        this._removed[point.coordinates] = point

        return delete this.cache[point.coordinates]
    }

    // find the siblings of this point and return the total number that are selected
    public countOfSelectedSiblings(point: Point): number {
        // for performance we're going to rely on this guy being in the cache for sure
        return point.neighbors().filter(neighborCoordinates => {
            const [[x, x_multiplier], [y, y_multiplier]] = neighborCoordinates
            const cacheKey = Point.cacheKey(x, x_multiplier, y, y_multiplier)
            return this.cache[cacheKey] && this.cache[cacheKey].selected
        }).length
    }
}
