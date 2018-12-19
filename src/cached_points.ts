import Point from "./point";

export default class CachedPoints {
    cache: Record<string, Point> = {}

    constructor() { }

    get cached(): Record<string, Point> {
        return this.cache
    }

    get visibleItems(): Object {
        // TODO hold visible ones and return them
        return {}
    }

    // add an item into the cache, has a side effect of hydrating siblings - could be more of a pure function
    public addOrUpdate(point: Point): void {
        if (!this.cache[point.coordinates]) {
            this.cache[point.coordinates] = point
        }
        this.cache[point.coordinates].selected = point.selected

        point.neighbors().forEach((neighborCoordinateKey) => {
            const cachedPoint = this.cache[neighborCoordinateKey]

            if (cachedPoint) {
                return
            }

            let [x, x_multiplier, y, y_multiplier] = neighborCoordinateKey.split(':')
            this.cache[neighborCoordinateKey] = new Point(parseInt(x), parseInt(x_multiplier), parseInt(y), parseInt(y_multiplier), false)
        })
    }

    // removes an item from the cache and adds to the removed list
    public remove(point: Point): boolean {
        this.cache[point.coordinates].selected = false

        if (!this.cache[point.coordinates]) {
            return false
        }

        return true

        // return delete this.cache[point.coordinates]
    }

    // find the siblings of this point and return the total number that are selected
    public countOfSelectedSiblings(point: Point): number {
        // for performance we're going to rely on this guy being in the cache for sure
        return point.neighbors().filter(neighborCoordinateKey => {
            const cachedPoint = this.cache[neighborCoordinateKey]
            return cachedPoint && cachedPoint.selected
        }).length
    }
}
