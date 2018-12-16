// index.ts
import message from './message'
import { createGrid, DOM, toggleSelected, cellIsSelected, getCellFromCoordinates, deselectCell, selectCell } from './dom_helpers'
import Point from './point'
import CachedPoints from './cached_points'
import './style.scss'

const runButton = document.getElementById('run')
const frameContainer = document.getElementById('frame')
const inputWrapper = document.getElementById('input')
const initialState = <HTMLInputElement>document.getElementById('initial-state')
const currentState = <HTMLInputElement>document.getElementById('meta')
let running: boolean = false
let frameCount: number = 0
const cachedPoints = new CachedPoints()

function addPoint(coordinates: bigint[], selected: boolean): void {
    const existingCachedItem = cachedPoints.find(coordinates)

    let point: Point

    if (existingCachedItem) {
        existingCachedItem.selected = !existingCachedItem.selected
        point = existingCachedItem
    } else {
        point = new Point(coordinates[0], coordinates[1], selected)
    }

    cachedPoints.addOrUpdate(point)
}

// This method determines if the UI contains any of the active points and displays them, it also serializes the cache into the textarea
function syncUi(visibleAddedPoints: Array<Point>, visibleRemovedPoints: Array<Point>): void {
    visibleAddedPoints.forEach(point => {
        const cell = getCellFromCoordinates(point.coordinates[0].toString(), point.coordinates[1].toString())
        selectCell(cell)
    })

    visibleRemovedPoints.forEach(point => {
        const cell = getCellFromCoordinates(point.coordinates[0].toString(), point.coordinates[1].toString())
        deselectCell(cell)
    })

    const selectedPoints = cachedPoints.cached
        .filter(coordinates => cachedPoints.find(coordinates).selected)
        .reduce((accumulator: string[][], coordinates) => {
            accumulator.push([coordinates[0].toString(), coordinates[1].toString()])
            return accumulator
        }, [])

    currentState.querySelector('pre').innerText = JSON.stringify(selectedPoints, null, 2)
    frameContainer.innerText = (frameCount++).toString()
}

function perform() {
    console.log(`Cache contains ${cachedPoints.cached.length} items`)
    if (!running) return

    const added = []
    const removed = []
    const surviving = []
    cachedPoints.cached.forEach(coordinate => {
        const point = cachedPoints.find(coordinate)
        const selectedSiblings: number = cachedPoints.countOfSelectedSiblings(point)

        if (point.selected && (selectedSiblings < 2 || selectedSiblings > 3)) {
            removed.push(point)
        }

        // be born!
        if (!point.selected && selectedSiblings === 3) {
            added.push(point)
        }

        // survive
        if (point.selected && (selectedSiblings == 2 || selectedSiblings == 3)) {
            surviving.push(point)
        }
    })

    // update the cache
    removed.forEach(point => cachedPoints.remove(point))
    added.concat(surviving).forEach(point => (point.selected = true) && cachedPoints.addOrUpdate(point))
    cachedPoints.cleanRemoved()

    syncUi(
        added.filter(point => {
            let x = point.coordinates[0]
            let y = point.coordinates[1]
            return point.selected && x < DOM.COLS && y < DOM.ROWS
        }),

        removed.filter(point => {
            let x = point.coordinates[0]
            let y = point.coordinates[1]
            return x < DOM.COLS && y < DOM.ROWS
        })
    )
    setTimeout(perform, 0)
}

// Add the ability to click cells to toggle them on and off
inputWrapper && inputWrapper.addEventListener('click', (e) => {
    const cell = e.srcElement
    addPoint(toggleSelected(cell), cellIsSelected(cell))
})

runButton && runButton.addEventListener('click', () => {
    // allow run button to start and stop
    if (running) {
        runButton.innerText = 'Restart'
        running = false
        return
    }

    running = true
    runButton.innerText = 'Stop'
    setTimeout(perform, 0)
})

initialState && initialState.addEventListener('change', () => {
    const newState = JSON.parse(initialState.value)
    newState.forEach(coordinates => {
        const cell = <HTMLElement>getCellFromCoordinates(coordinates[0], coordinates[1])
        cell.click()
    })
})

createGrid(inputWrapper)
