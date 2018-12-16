import Point from "./point";

export default class CachedPoints {
    // We're going to use an array to hold the active points and use the slower `find` approach to pull back each item we
    // are interested in.  The preference would be to use a hash where the key was an array of the `x` and `y` coordinates
    // which would make lookup very snappy, however I found I cannot use an object as they key in Typescript and I cannot 
    // serialize the larger numbers without losing percision. 

    // If speed is important or this approach proves itself to be too slow, I would move this structure onto a language 
    // where the map approach was possible - probably shouldve picked Ruby...

    cache: Array<Point> = []
    private _removed: Array<Point> = []

    constructor() { }

    get cached(): bigint[][] {
        return this.cache.map(point => point.coordinates)
    }

    get removedItems(): bigint[][] {
        return this._removed.map(point => point.coordinates)
    }

    public cleanRemoved(): void {
        this._removed = []
    }

    // add an item into the cache, has a side effect of hydrating siblings - could be more of a pure function
    public addOrUpdate(point: Point): void {
        const existingPoint = this.find(point.coordinates)
        if (!existingPoint) {
            this.cache.push(point)
        } else {
            existingPoint.selected = point.selected
        }

        point.neighbors().forEach((neighboringCoordinates: bigint[]) => {
            // if our neighbor already exists, we've nothing to do
            if (this.find(neighboringCoordinates)) {
                return
            }

            this.cache.push(new Point(neighboringCoordinates[0], neighboringCoordinates[1], false))
        })
    }

    // safely removes an item from the cache returning `true` if it succeeds and `false` if it does not
    public remove(point: Point): boolean {
        const indexToRemove = this.findIndexInCache(point.coordinates)
        if (indexToRemove == -1) {
            return false
        }

        this._removed.push(this.cache.splice(indexToRemove, 1)[0])
        return true
    }

    // get the cached item if it exists
    public find(coordinates: bigint[]): Point {
        const index = this.findIndexInCache(coordinates)
        if (index == -1) return null;
        return this.cache[index]
    }

    // find the siblings of this point and return the total number that are selected
    public countOfSelectedSiblings(point: Point): number {
        // for performance we're going to rely on this guy being in the cache for sure
        return point.neighbors().filter(coordinates => {
            const neighboringIndex = this.findIndexInCache(coordinates)
            return neighboringIndex > -1 && this.cache[neighboringIndex].selected
        }).length
    }

    // returns the index of the object you seek
    private findIndexInCache(coordinates: bigint[]): number {
        let x
        let y
        [x, y] = coordinates
        return this.cache.findIndex(point => {
            return point.coordinates[0] == x && point.coordinates[1] == y
        })
    }
}
